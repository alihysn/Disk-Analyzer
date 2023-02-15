use filesize::PathExt;
use fs_extra::dir::get_size;
use std::error::Error;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};
extern crate filesize;
extern crate fs_extra;
extern crate walkdir;

#[derive(Serialize, Deserialize)]
pub struct Content {
    pub name: String,
    pub size: u64,
    pub lastAccessed: u64,
    pub file_type: bool,
}

#[tauri::command]
fn print_args(dir: &str) -> Vec<Content> {
    let mut directory = PathBuf::new();
    directory.push(dir.to_string());  //dir_path is the name of the string from user

    let mut content: Vec<Content>=Default::default();

    for entry in fs::read_dir(directory).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let metadata = fs::metadata(entry.path()).unwrap();
        let name = path.file_stem().unwrap().to_os_string().into_string().unwrap();
        let accessed = metadata.accessed().unwrap().elapsed().unwrap().as_secs();
        let size = get_size(&path).unwrap();
        let mut ftype = false;
        if (path.is_dir()) {
            ftype = true;
        }
        let temp = Content{name:name, size:size, lastAccessed:accessed, file_type:ftype};
        content.push(temp);
    }
    return content;
}

#[tauri::command]
fn sort_by_size(dir: &str) -> Vec<Content> {
    let mut x = print_args(dir);
    x.sort_by(|a, b| b.size.cmp(&a.size));
    return x;
}

#[tauri::command]
fn sort_by_access(dir: &str) -> Vec<Content> {
    let mut x = print_args(dir);
    x.sort_by(|a, b| a.lastAccessed.cmp(&b.lastAccessed));
    return x;
}

#[tauri::command]
fn top_10(dir: &str) -> Vec<Content> {
    let mut x = print_args(dir);
    x.sort_by(|a, b| (b.lastAccessed, b.size).cmp(&(a.lastAccessed, a.size)));
    let mut top_ten: Vec<Content> = Default::default();
    let mut counter = 0;
    for entry in x {
        if counter == 10 {
            break;
        }
        top_ten.push(entry);
        counter += 1;
    }
    return top_ten;
}

#[tauri::command]
fn cluster_by_size(dir: &str) -> Vec<i32> {
    let mut x = print_args(dir);
    let mut ret = Vec::new();
    ret.push(0);
    ret.push(0);
    ret.push(0);
    ret.push(0);

    let index = 1024 * 1024;

    for entry in x {
        if entry.size < index {
            ret[0] += 1;
        } else if entry.size >= index && entry.size < 5 * index {
            ret[1] += 1;
        } else if entry.size >= 5 * index && entry.size < 10 * index {
            ret[2] += 1;
        } else {
            ret[3] += 1;
        }
    }
    return ret;
}

#[tauri::command]
fn cluster_by_date(dir: &str) -> Vec<i32> {
    let mut x = print_args(dir);
    let mut ret = Vec::new();
    ret.push(0);
    ret.push(0);
    ret.push(0);
    ret.push(0);

    let month = 24 * 60 * 60 * 30;

    for entry in x {
        if entry.size < month {
            ret[0] += 1;
        } else if entry.size >= month && entry.size < 6 * month {
            ret[1] += 1;
        } else if entry.size >= 6 * month && entry.size < 12 * month {
            ret[2] += 1;
        } else {
            ret[3] += 1;
        }
    }
    return ret;
}


#[tauri::command]
fn greet() -> String {
    return "Msa Msa".to_string();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, print_args, 
            sort_by_size, sort_by_access, top_10,
            cluster_by_date, cluster_by_size])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
