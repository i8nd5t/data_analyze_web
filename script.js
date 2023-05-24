google.charts.load('visualization', {packages: ['corechart','table']});

let column_names = undefined;
let columnData = undefined;
let isnot_num_column = undefined;

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//アップロード後
function handleFile() {
  let fileInput = document.getElementById("csvFileInput");
  let file = fileInput.files[0];

  let reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    processData(contents);
  };
  reader.readAsText(file);
}

function processData(csv) {
  let data = csv.split("\n");
  column_names = data[0].split(",");
  columnData = {};
  isnot_num_column = Array(column_names.length).fill(0);

  for (let i = 0; i < column_names.length; i++) {
    columnData[column_names[i]] = [];
  }

  for (let j = 1; j < data.length; j++) {
    let row = data[j].split(",");
    for (let k = 0; k < column_names.length; k++) {
      if (row[k] == '' || row[k] == undefined) {
        continue
      }
      if (isNaN(Number(row[k]))) {
        isnot_num_column[k] = 1;
      }
      columnData[column_names[k]].push(Number(row[k]));
    }
  }
  displayTable(column_names, columnData, isnot_num_column);
  displayChart(column_names, columnData, isnot_num_column);

}

function getArrayStats(arr) {
    const count = arr.length;
  
    // 平均を計算
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
  
    // 標準偏差を計算
    const squaredDifferences = arr.map((val) => (val - mean) ** 2);
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / count;
    const standardDeviation = Math.sqrt(variance);
  
    // 最小値を取得
    const min = Math.min(...arr);
  
    // 最大値を取得
    const max = Math.max(...arr);
  
    return [
      String(count.toFixed(5)),
      String(mean.toFixed(5)),
      String(standardDeviation.toFixed(5)),
      String(min.toFixed(5)),
      String(max.toFixed(5)),
    ];
}

// function displayTable(column_names,columnData,isnot_num_column) {
//     let data = [];
//     const data_column_names = [];
//     const data_row_names = [
//         "count",
//         "mean",
//         "std",
//         "min",
//         "max",
//     ]
//     for (let m = 0; m < column_names.length; m++) {
//         if (isnot_num_column[m]) {
//             continue;
//         }
//         data.push(getArrayStats(columnData[column_names[m]]))
//         data_column_names.push(column_names[m])
//     }
//     const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
//     data = transpose(data);

    
//     var table = document.createElement('table');
//     table.classList.add('data-table');
//     table.style.width = "100%";

//     var headerRow = document.createElement('tr');
//     var emptyHeaderCell = document.createElement('th'); // 空の見出しセルを作成
//     headerRow.appendChild(emptyHeaderCell); // 空の見出しセルを追加

//     for (var j = 0; j < data[0].length; j++) {
//         var headerCell = document.createElement('th');
//         headerCell.textContent = data_column_names[j];
//         headerRow.appendChild(headerCell);
//     }
//     table.appendChild(headerRow);

//     for (var i = 0; i < data.length; i++) {
//         var dataRow = document.createElement('tr');

//         var rowHeader = document.createElement('th');
//         rowHeader.textContent = data_row_names[i];
//         dataRow.appendChild(rowHeader);

//         for (var j = 0; j < data[i].length; j++) {
//             var dataCell = document.createElement('td');
//             dataCell.textContent = data[i][j];
//             dataRow.appendChild(dataCell);
//         }

//         table.appendChild(dataRow);
//     }

//     var container = document.getElementById('tableContainer');
//     container.innerHTML = '';
//     container.appendChild(table);
// }

function displayTable(column_names, columnData, isnot_num_column) {
  let data = [];
  const data_column_names = [];
  const data_row_names = [
    "count",
    "mean",
    "std",
    "min",
    "max",
  ];
  for (let m = 0; m < column_names.length; m++) {
    if (isnot_num_column[m]) {
      continue;
    }
    data.push(getArrayStats(columnData[column_names[m]]));
    data_column_names.push(column_names[m]);
  }
  const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
  data = transpose(data);

  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', ''); // 空の列を追加

  for (let j = 0; j < data_column_names.length; j++) {
    dataTable.addColumn('string', data_column_names[j]);
  }

  for (let i = 0; i < data_row_names.length; i++) {
    let rowData = [data_row_names[i]];
    for (let j = 0; j < data_column_names.length; j++) {
      rowData.push(data[i][j]);
    }
    dataTable.addRow(rowData);
  }
  // console.log(dataTable)

  const table = new google.visualization.Table(document.getElementById('tableContainer'));
  table.draw(dataTable, {
    allowHtml: true,
    width: '100%',
    cssClassNames: {
      headerRow: 'google-table-header',
      tableRow: 'google-table-row',
      oddTableRow: 'google-table-row-odd',
      headerCell: 'google-table-header-cell',
      tableCell: 'google-table-cell',
    },
  });
}

function displayChart(column_names, columnData, isnot_num_column) {
    let chartsContainer = document.getElementById('chartsContainer');
    chartsContainer.innerHTML = '';
    for (let m = 0; m < column_names.length; m++) {
        if (isnot_num_column[m]) {
            continue;
        }
        let container = document.createElement('div');
        container.id = 'chart' + m;
        container.classList.add('chart')
        // container.style.width = "100%"
        chartsContainer.appendChild(container);
    
        let dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', column_names[m]);
    
        let dataArray = columnData[column_names[m]].map(function(value) {
          return [value];
        });
    
        dataTable.addRows(dataArray);
    
        let options = {
          width: '100%',
          height: '100%',
          title: column_names[m],
          histogram: { bucketSize: 1 },
          legend: { position: 'none' },
          hAxis: {
            viewWindow: { min: 0 }
          }
        };
    
        let chart = new google.visualization.Histogram(container);
        chart.draw(dataTable, options);
      }
    adjust_layout()
}

function adjust_layout() { 
  console.log(document.querySelector("#chart0 > div > div:nth-child(1) > div > svg > g:nth-child(4)").style.width)
  console.log(document.querySelector("#chart0 > div > div:nth-child(1) > div > svg > g:nth-child(4)").width)
}

window.onresize = function(){
  if (column_names) {
    displayChart(column_names, columnData, isnot_num_column);
  }
}