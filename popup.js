chrome.storage.local.get(['candicates'], function(result) {
  console.log(result.candicates);
  result.candicates.forEach(element => {
    if(element.url.indexOf('zhaopin.com')) {
      element.source = '智联招聘';
    }

    document.querySelector('tbody').insertAdjacentHTML('beforeend',
    '<tr>'
    + '<td>' + element.date +'</td>'
    + '<td>' + '<a id="a'+ element.mobilePhone +'">' + element.candidateName + '</a>' +'</td>'
    + '<td>' + element.as +'</td>'
    + '<td>' + element.mobilePhone +'</td>'
    + '<td>' + '网络' +'</td>'
    + '<td>' + element.source +'</td>'
    + '</tr>'
    );
    document.querySelector('#a' + element.mobilePhone).onclick = function(){
      newTab(element.url);
    };
  });
});

function newTab(url) {
  chrome.tabs.create({url: url});
}

function toExcel() {
  var elt = document.getElementById('data-table');
  var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
  XLSX.writeFile(wb, '应聘候选人名单.xlsx');
}
document.querySelector('#toExcel').onclick = toExcel;

function clear() {
  if(confirm('确定要清空候选人名单吗')){
    chrome.storage.local.set({candicates: []}, function(result) {
      console.log('candidate list cleared');
    });  
  }
}
document.querySelector('#clear').onclick = clear;