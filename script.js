google.charts.load('current', {packages: ['corechart']});

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
    // 2次元配列の例
        var aaaaa = [
        [1, 2, 3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,0],
        [1,2,3,4,5,6,7,8,9,0],
        ];

    // 表を表示
    displayTable(aaaaa);
  let data = csv.split("\n");
  let columns = data[0].split(",");
  let columnData = {};
  let isnot_num_column = Array(columns.length).fill(0);

  for (let i = 0; i < columns.length; i++) {
    columnData[columns[i]] = [];
  }

  for (let j = 1; j < data.length; j++) {
    let row = data[j].split(",");
    for (let k = 0; k < columns.length; k++) {
      if (row[k] == '' || row[k] == undefined) {
        continue
      }
      if (isNaN(Number(row[k]))) {
        isnot_num_column[k] = 1;
      }
      columnData[columns[k]].push(Number(row[k]));
    }
  }
  displayChart(columns, columnData, isnot_num_column);

}

function getArrayStats(arr) {
    const count = arr.length;
  
    // 平均を計算
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / count;
  
    // 標準偏差を計算
    const squaredDifferences = arr.map((val) => (val - average) ** 2);
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / count;
    const standardDeviation = Math.sqrt(variance);
  
    // 最小値を取得
    const min = Math.min(...arr);
  
    // 最大値を取得
    const max = Math.max(...arr);
  
    return [
      count,
      average,
      standardDeviation,
      min,
      max,
    ];
}

function displayTable(columns,columnData,isnot_num_column) {
    var table = document.createElement('table');

    var headerRow = document.createElement('tr');
    var emptyHeaderCell = document.createElement('th'); // 空の見出しセルを作成
    headerRow.appendChild(emptyHeaderCell); // 空の見出しセルを追加

    for (var j = 0; j < data[0].length; j++) {
        var headerCell = document.createElement('th');
        headerCell.textContent = 'Column ' + (j + 1);
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    for (var i = 0; i < data.length; i++) {
        var dataRow = document.createElement('tr');

        var rowHeader = document.createElement('th');
        rowHeader.textContent = 'Row ' + (i + 1);
        dataRow.appendChild(rowHeader);

        for (var j = 0; j < data[i].length; j++) {
            var dataCell = document.createElement('td');
            dataCell.textContent = data[i][j];
            dataRow.appendChild(dataCell);
        }

        table.appendChild(dataRow);
    }

    var container = document.getElementById('tableContainer');
    container.innerHTML = '';
    container.appendChild(table);
}

function displayChart(columns, columnData, isnot_num_column) {
    let chartsContainer = document.getElementById('chartsContainer');
    chartsContainer.innerHTML = '';
    for (let m = 0; m < columns.length; m++) {
        if (isnot_num_column[m]) {
            continue;
        }
        let container = document.createElement('div');
        container.id = 'chart' + m;
        chartsContainer.appendChild(container);
    
        let dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', columns[m]);
    
        let dataArray = columnData[columns[m]].map(function(value) {
          return [value];
        });
    
        dataTable.addRows(dataArray);
    
        let options = {
          title: columns[m],
          histogram: { bucketSize: 1 },
          legend: { position: 'none' },
          hAxis: {
            viewWindow: { min: 0 }
          }
        };
    
        let chart = new google.visualization.Histogram(container);
        chart.draw(dataTable, options);
      }
}
