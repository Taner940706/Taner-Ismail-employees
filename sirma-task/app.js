// variable for storing data as nested array
let datas = []

// main function for uploading file from file system
async function uploadFromFileSystem(){
    let dict = {}
    let [fileHandle] = await window.showOpenFilePicker();
    let getData = await fileHandle.getFile();
    let text = await getData.text();
    let splitted_text = text.split('\n')
    for (i of splitted_text){
        // split file with delimeter ", ", can read .csv files and txt. files
        let arr = i.split(", ")
        // check if key is exist in dictionary
        if (dict.hasOwnProperty(arr[1])){
            // if exist, then push the dictionary with key second employee and start/end dates
            dict[arr[1]][0].push(arr[0])
            dict[arr[1]][1].push(convertToDate(arr[2]))
            dict[arr[1]][1].push(convertToDate(arr[3]))
            dict[arr[1]][1].sort((a,b) => a-b)
        }
        else{
            // if doesn't exist, create new record with this key
            dict[arr[1]] = [[arr[0]], [convertToDate(arr[2]), convertToDate(arr[3])]]
        }
    }
    
    // this for loop is to find projects that include more than one employees (in this project two), add them to the nested array with correct structure and find together worked days
    for (const [key, value] of Object.entries(dict)) {
        if (value[0].length > 1){
            datas.push([value[0][0], value[0][1], key, (value[1][2].getTime() - value[1][1].getTime())/ (1000 * 3600 * 24)])
        }
      }

    buildTable(datas)
    findMaxDays(datas)

}


// convert NULL to current date or string to date (Bonus points)
function convertToDate(str){
    let date = new Date();
    if (str == "NULL"){
        return date
    }
    else{
        return new Date(str)
    }
}



// create table with necessary data
function buildTable(data){
    let table = document.getElementById('myTable')
    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <td>${data[i][0]}</td>
                        <td>${data[i][1]}</td>
                        <td>${data[i][2]}</td>
                        <td>${data[i][3]}</td>
                  </tr>`
        table.innerHTML += row
    }
}


// find max worked days and add as a text to the paragraph
function findMaxDays(arr){
    let res = []
        for (let i of arr){
            res.push(i[3])
        }
    document.getElementById('result').innerHTML="The pair of employees who have worked together on common projects for the longest period of time is: "+datas.find(element => element[3] == Math.max(...res))
}
