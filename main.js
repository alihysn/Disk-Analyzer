
const { invoke } = window.__TAURI__.tauri;
let search_input_el;
let greetMsgEl;
let all_content;
let size_cluster, date_cluster;
let proper_array = [];

async function all_functions() {
  proper_array = [];
  for (var el in all_content)
    proper_array.push(all_content[el]);
  size_cluster = await invoke("cluster_by_size", {dir : search_input_el.value });
  date_cluster = await invoke("cluster_by_date", {dir : search_input_el.value });
  searchFiles();
  drawPiechart();
  drawMultSeries();
  drawMultSeries2();
}

async function search() {
  console.log("In search");
  all_content = [];
  all_content = await invoke("print_args", {dir : search_input_el.value });
  all_functions();
}

async function sort_by_size() {
  console.log("In search");
  all_content = [];
  all_content = await invoke("sort_by_size", {dir : search_input_el.value });
  all_functions();
}

async function sort_by_access() {
  console.log("In search");
  all_content = [];
  all_content = await invoke("sort_by_access", {dir : search_input_el.value });
  all_functions();
}

async function top_10() {
  console.log("In search");
  all_content = [];
  all_content = await invoke("top_10", {dir : search_input_el.value });
  all_functions();
}

window.addEventListener("DOMContentLoaded", () => {
  search_input_el = document.querySelector("#search-bar");
  document
    .querySelector("#search-bar")
    .addEventListener("keypress", function (e) {
      if (e.key === 'Enter') {
          search();
      }
    });
  document
    .querySelector("#sortsize")
    .addEventListener("click", () => sort_by_size());
  document
    .querySelector("#sortaccess")
    .addEventListener("click", () => sort_by_access());
  document
    .querySelector("#topten")
    .addEventListener("click", () => top_10());
});

// Load google charts
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawPiechart);

// Draw the chart and set the chart values
function drawPiechart() {
  let piechart_data = [];
  piechart_data.push(["Entry", "Size"]);
  for (var i = 0; i < proper_array.length; i++) {
      piechart_data.push([proper_array[i].name, proper_array[i].size]);
  }

  var data = google.visualization.arrayToDataTable(piechart_data);

  var options = {
    title: "Size Distribution",
    width: 1080,
    height: 860,
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart.draw(data, options);
}

google.charts.load("current", { packages: ["corechart", "bar"] });
google.charts.setOnLoadCallback(drawMultSeries);

function drawMultSeries() {
  var data2 = google.visualization.arrayToDataTable([
    ["Size Category", "Number of Entries"],
    ["Less than 1 MB", size_cluster[0]],
    ["Between 1 MB and 5 MB", size_cluster[1]],
    ["Between 5 MB and 10 MB", size_cluster[2]],
    ["More than 10 MB", size_cluster[3]],
  ]);

  var options2 = {
    title: "Entries Clustered According To Size",
    chartArea: { 
      width: "50%" 
    },
    hAxis: {
      title: "Number of Entries",
      minValue: 0,
    },
    vAxis: {
      title: "Size Category",
    },
    legend: { position: "none" },
  };

  var chart2 = new google.visualization.BarChart(
    document.getElementById("barChart")
  );
  chart2.draw(data2, options2);
}

google.charts.load("current", { packages: ["corechart", "bar"] });
google.charts.setOnLoadCallback(drawMultSeries2);

function drawMultSeries2() {
  var data3 = google.visualization.arrayToDataTable([
    ["Time Category", "Number of Entries"],
    ["Before 1 Month", date_cluster[0]],
    ["Between 1 Month and Half A Year", date_cluster[1]],
    ["Between Half A Year and A Year", date_cluster[2]],
    ["More than a Year", date_cluster[3]],
  ]);

  var options3 = {
    title: "Entries Clustered According to last accessed time",
    chartArea: { width: "50%" },
    hAxis: {
      title: "Number of Entries",
      minValue: 0,
    },
    vAxis: {
      title: "Time Category",
    },

    legend: { position: "none" },
  };

  var chart3 = new google.visualization.BarChart(
    document.getElementById("barChart2")
  );
  chart3.draw(data3, options3);
}

async function searchFiles() {
  var myUL = document.getElementById("myUL");
  myUL.innerHTML = "";
  {
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.padding = "10px";
    div.style.borderBottom = "1px solid black";

    var div2 = document.createElement("div");
    div2.style.display = "flex";
    div2.style.flexDirection = "row";

    var div3 = document.createElement("div");
    div3.style.display = "flex";
    div3.style.flexDirection = "column";

    var div4 = document.createElement("div");
    div4.style.fontSize = "20px";
    div4.innerHTML = "Entry Name";

    var div5 = document.createElement("div");
    div5.style.fontSize = "15px";
    div5.innerHTML = "Entry Type";

    var div6 = document.createElement("div");
    div6.style.display = "flex";
    div6.style.flexDirection = "column";

    var div7 = document.createElement("div");
    div7.style.fontSize = "20px";
    div7.innerHTML = "Entry Size";

    var div8 = document.createElement("div");
    div8.style.fontSize = "15px";
    div8.innerHTML = "Last Accessed";

    div3.appendChild(div4);
    div3.appendChild(div5);

    div2.appendChild(div3);

    div6.appendChild(div7);
    div6.appendChild(div8);

    div.appendChild(div2);
    div.appendChild(div6);

    li.appendChild(div);

    myUL.appendChild(li);
  }

  for (var i = 0; i < proper_array.length; i++) {
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.padding = "10px";
    div.style.borderBottom = "1px solid black";

    var div2 = document.createElement("div");
    div2.style.display = "flex";
    div2.style.flexDirection = "row";

    var div3 = document.createElement("div");
    div3.style.display = "flex";
    div3.style.flexDirection = "column";

    var div4 = document.createElement("div");
    div4.style.fontSize = "20px";
    div4.innerHTML = proper_array[i].name;

    var div5 = document.createElement("div");
    div5.style.fontSize = "15px";
    if (proper_array[i].file_type)
      div5.innerHTML = "Folder";
    else 
      div5.innerHTML = "File";

    var div6 = document.createElement("div");
    div6.style.display = "flex";
    div6.style.flexDirection = "column";

    var div7 = document.createElement("div");
    div7.style.fontSize = "20px";
    let mbs = (proper_array[i].size / (1024.0 * 1024.0));
    mbs = Math.floor(mbs * 10000) / 10000.0;
    div7.innerHTML = mbs.toString().concat(" MB");

    var div8 = document.createElement("div");
    div8.style.fontSize = "15px";
    let lAA = (proper_array[i].lastAccessed / (60.0 * 60 * 24));
    lAA = Math.floor(lAA * 100.0) / 100.0;
    div8.innerHTML = lAA.toString().concat(" days ago.");

    div3.appendChild(div4);
    div3.appendChild(div5);

    div2.appendChild(div3);

    div6.appendChild(div7);
    div6.appendChild(div8);

    div.appendChild(div2);
    div.appendChild(div6);

    li.appendChild(div);

    myUL.appendChild(li);
  }
}
searchFiles();