// API lấy danh sách product
function getProductAPI() {
  return axios.get("/products"); // => luôn trả về promise
}
//Khai báo biến
let products = []; //Mảng item
let promotionCode = {
  A: 10,
  B: 20,
  C: 30,
  D: 40,
}; //Mảng code giảm giá
// Lấy danh sách todo
async function getProduct() {
  try {
    const res = await getProductAPI();
    products = res.data;
    //console.log(products);
    // Render ra ngoài giao diện
    renderItem(products);
  } catch (error) {
    console.log(error);
  }
}

// Random id ngẫu nhiên trong khoảng 0 -> 100000
function randomId() {
  return Math.floor(Math.random() * 100000);
}

let item = document.querySelectorAll(".item");
let item_list = document.querySelector(".item-list");
let discount = document.querySelector(".discount");
let itemCount = document.querySelector(".item-count");
let delBtn = document.querySelector(".delBtn");

//Truy cập vào các phần tử tính toán tiền
let sub_cost = document.querySelector(".sub-cost");
let tax = document.querySelector(".tax-total");
let total = document.querySelector(".total-amount");
let discountTotal = document.querySelector(".discount-total");

//Function render item ra màn hình
function renderItem(arr) {
  //Đếm item trong giỏ
  itemCount.innerHTML = `${countItem(arr)} item in the bag`;
  item_list.innerHTML = "";

  //Render item trong data base
  if (arr.length === 0) {
    item_list.innerHTML = "Không có sản phẩm trong giỏ hàng";
    discount.style.display = "none";
    return;
  }
  totalAmount(arr);
  for (let i = 0; i < arr.length; i++) {
    let p = arr[i];
    item_list.innerHTML += `<div class="item">
          <div class="info">
            <div class="thumbnail"><img src="${p.image}" alt="" /></div>
            <div class="item-info">
              <div class="item-name">${p.name}</h2></div>
              <div class="description">${p.description}</div>
              <div class="price">${p.price} VND</div>
            </div>
          </div>
          <div class="quantity">
 <input
  type="number"
  class="quantity"
  step="1"
  value="${p.count}"
  onchange="changeItem(${p.id}, event)"
/>
</div>
          <div class="del-btn" >
            <button class="delBtn" onClick="delItem(${p.id})">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                />
              </svg>
            </button>
          </div>
        </div>`;
  }
}

window.onload = () => {
  getProduct();
};

//Function đếm item
function countItem(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    p = arr[i];
    total += p.count;
  }
  return total;
}

//Function xóa item trong giỏ hàng
function delItem(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      products.splice(i, 1);
    }
  }
  renderItem(products);
}

//Function thêm số lượng hàng vào giỏ
function changeItem(id, e) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products[i].count = Number(e.target.value);
    }
  }
  renderItem(products);
}

//Function convert USD sang VND
function convertMoney(num) {
  return num.toLocaleString("it-IT", { style: "currency", currency: "VND" });
}

//Function tính toán tiền hàng
function totalAmount(arr) {
  let totalMoney = 0; //Tổng tiền trước thuế không có giảm giá
  let discountMoney = 0; //Tổng số tiền được giảm giá

  for (let i = 0; i < arr.length; i++) {
    const p = arr[i];
    totalMoney += p.count * p.price;
  }
  let data = codeCheck();
  if (data) {
    discountMoney = (totalMoney * data) / 100;
    
  } 
  sub_cost.innerText = convertMoney(totalMoney);
  tax.innerText = convertMoney(totalMoney * 0.05);
  discountTotal.innerText = convertMoney(discountMoney);
  total.innerText = convertMoney(totalMoney * 1.05 - discountMoney);
}

//Tính toán tiền khi có mã giảm giá. Check code có hợp lệ không
let inputCode = document.querySelector("#promo-code");
function codeCheck() {
  let value = inputCode.value;
  if (promotionCode[value]) {
    return promotionCode[value];
  } else return 0;
}

//Truy cập nút nhập mã
let codeBtn = document.querySelector(".enter-btn button");
codeBtn.addEventListener("click", function () {
  totalAmount(products);
  inputCode.value = "";
});
