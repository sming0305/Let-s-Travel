const list = document.querySelector(".list");
const locationSearch = document.querySelector("#locationSearch");
const noSearchInformation = document.querySelector(".noSearchInformation");
const countNum = document.querySelector("#count");
const title = document.querySelector("#name");
const img = document.querySelector("#img");
const addlocation = document.querySelector("#addlocation");
const setPrice = document.querySelector("#price");
const groupNum = document.querySelector("#groupNum");
const star = document.querySelector("#star");
const describe = document.querySelector("#describe");
const addSetButton = document.querySelector("#addSetButton");
const form = document.querySelector("#addform");


let data = [];
let chartData = [];


axios.get("https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json")
  .then(response => {
    data = response.data;
    init();
  }).catch(error => {
    console.log(error);
  })

function alertinfo(mark, info) {
  Swal.fire({
    icon: mark,
    title: info,
    showConfirmButton: false,
    timer: 1800
  });
}

//新增套票
addSetButton.addEventListener("click", function (e) {
  let name = title.value.trim();
  let imgUrl = img.value.trim();
  let area = addlocation.value;
  let price = setPrice.value.trim();
  let group = groupNum.value.trim();
  let rate = star.value.trim();
  let description = describe.value.trim();
  let id = length;

  let error = [name, imgUrl, price, group, rate, description];
  let errorRule = {
    0: "套票名稱",
    1: "圖片網址",
    2: "套票金額",
    3: "套票組數",
    4: "套票星級",
    5: "套票描述"
  }

  let errorSpace = error.findIndex(item => item === "");

  if (errorSpace !== -1) {

    alertinfo("error", `新增套票時
    ${errorRule[errorSpace]}不可空白`);
    return;
  }
  else if (area === "請選擇景點地區") {
    alertinfo("error", "請選擇景點地區");
    return;
  }
  else if (isNaN(parseInt(price)) || isNaN(parseInt(group)) || isNaN(parseInt(rate))) {
    alertinfo("error", "套票金額.組數.星級 僅允許輸入數值")
    return;
  }
  else if (rate > 10 || rate < 1) {
    alertinfo("error", "套票星級僅允許輸入1~10");
    return;
  }

  data.push({ area, description, group, id, imgUrl, name, price, rate });

  form.reset();
  locationSearch.value = "全部地區";
  alertinfo("success", "新增成功");
  render(data);
})


// 渲染
function render(dataBase) {

  let info = ``;
  let noInfoString = `<div>
  <p class="fs-16 fw-bold text-gary py-5 px-30 text-center">查無相關資料</p>
  <img src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/js_week5/no_found.png" class="mx-auto" alt="not_found">
  </div>`;
  let count = dataBase.length;
  let chartObj = {};


  dataBase.length === 0 ? noSearchInformation.innerHTML = noInfoString : noSearchInformation.innerHTML = "";

  dataBase.forEach(item => {

    info += `<li class="list__card shadow rounded-2 mb-19 d-flex flex-column">
  <div class="position-relative">
      <p class="position-absolute px-5 py-10 bg-color-secondary text-white fs-10 line-height-1_2 rounded-ex-2 z-6"
          style="top: -12px">${item.area}</p>
      <span class="position-absolute px-2 py-4 bg-color-primany text-white rounded-ex-2 z-6 list__card__rate">${item.rate}</span>
      <div class="over-hidden">
          <img src="${item.imgUrl}"
              alt="櫻花" class="list__card__img">
      </div>
  </div>
  <div class="py-10 pt-10 pb-7 d-flex flex-column flex-grow-1">
      <h3 class="fs-12 fw-bold pb-2 border-bottom-2 border-primany mb-8 list__card__title">
      ${item.name}</h3>
      <p class="text-gary mb-11 flex-grow-1">
      ${item.description}
      </p>
      <div class="d-xs-flex justify-content-between align-items-center">
          <p class="fw-bold d-xs-flex text-center align-items-center"><span
                  class="material-symbols-outlined me-3 fs-10">
                  error
              </span>剩下最後${item.group}組</p>
          <p class="fw-Medium d-xs-flex text-center align-items-center">TWD<span
                  class="fs-16 ms-2">${item.price}</span>
          </p>
      </div>
  </div>
  </li>`;


  })

  list.innerHTML = info;
  countNum.textContent = `本次搜尋共 ${count} 筆資料`;


  // 新增套票時重新渲染圖表

  data.forEach(item => {
    chartObj[item.area] === undefined ? chartObj[item.area] = 1 : chartObj[item.area] += 1;
  });

  let chartlocation = Object.keys(chartObj);
  chartData = [];
  chartlocation.forEach(item => {
    let areaInfo = [];
    areaInfo.push(item);
    areaInfo.push(chartObj[item]);
    chartData.push(areaInfo);
  })



  var chart = c3.generate({
    size: {
      height: 220,
      width: 220
    },
    data: {
      columns: chartData,
      type: 'donut',
      colors: {
        高雄: '#E68618',
        台北: '#5151D3',
        台中: '#26C0C7'
      }
    },
    donut: {
      title: "套票地區比重",
      width: 15
    },
  });

}

//篩選
locationSearch.addEventListener("change", e => {
  let target = locationSearch.value;
  let newData = data.filter(item => item.area === target);

  target === "全部地區" ? render(data):render(newData);
})

function init() {
  render(data);
}













