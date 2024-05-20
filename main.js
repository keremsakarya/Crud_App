//? Düzenleme seçenekleri
let editFlag = false
let editElement // Düzenleme yapılan öğeyi temsil eder
let editID = "" // Düzenleme yapılan öğenin benzersiz kimliği

//? Gerekli html elementlerini seçme
const form = document.querySelector(".grocery-form")
const grocery = document.getElementById("grocery")
const list = document.querySelector(".grocery-list")
const alert = document.querySelector(".alert")
const submitBtn = document.querySelector(".submit-btn")
const clearBtn = document.querySelector(".clear-btn")


//! Fonksiyonlar

//? Ekrana bildirim bastıracak fonksiyondur
const displayAlert = (text, action) => {
    alert.textContent = text // Alert class lı etiketin içerisini , dışarıdan gönderilen parametre ile değiştirir
    alert.classList.add(`alert-${action}`) // p etiketine dinamik class ekler

    setTimeout(() => {
        alert.textContent = "" // p etiketinin içerisini boş stringe çevirir
        alert.classList.remove(`alert-${action}`) // Eklenilen class kaldırılır
    }, 2000)
}

// Varsayılan değerlere döndürür
const setBackToDefault = () => {
    grocery.value = ""
    editFlag = false
    editID = ""
    submitBtn.textContent = "Add"
}

const addItem = (event) => {
    event.preventDefault() // Formun gönderilme olayında sayfanın yenilenmesini engeller
    const value = grocery.value // İnput un içerisine giren değeri alır
    const id = new Date().getTime().toString() // Benzersiz bir id oluşturur

    // Eğer input un içi boş değilse ve düzenleme modunda değilse
    if (value !== "" && !editFlag) {
        const element = document.createElement("article") // Yeni article öğesi oluşturur
        let attr = document.createAttribute("data-id") // Yeni bir veri kimliği oluşturur
        attr.value = id
        element.setAttributeNode(attr) // Oluşturulan id yi data özellik olarak set eder
        element.classList.add("grocery-item") // Article etiketine class ekler
        element.innerHTML = `
        <p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="delate-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
        `
        // Oluşturulan butonlara olay izleyicileri ekleyebilmek için seçildi
        const delateBtn = element.querySelector(".delate-btn")
        delateBtn.addEventListener("click", delateItem)
        const editBtn = element.querySelector(".edit-btn")
        editBtn.addEventListener("click", editItem)

        list.appendChild(element) // Oluşturulan article etiketini html e ekler 
        displayAlert("Added Successfully", "success")
        // Varsayılan değerlere döndürecek fonksiyon
        setBackToDefault()
        addToLocalStorage(id, value)
    } else if (value !== "" && editFlag) {
        editElement.innerHTML = value // Güncellenecek elemanın içeriği değiştirilir
        displayAlert("Changed Successfully", "success")
        console.log(editID)
        editLocalStore(editID, value)
        setBackToDefault()
    }
}

// Silme butonuna tıklanıldığında çalışır
const delateItem = (e) => {
    const element = e.target.parentElement.parentElement.parentElement // Silinecek etikete kapsayıcılar yardımı ile ulaşıldı
    const id = element.dataset.id
    console.log(element)
    list.removeChild(element) // Bulunan article etiketini list alanı içerisinden kaldırır
    displayAlert("Removed Successfully", "danger") // Ekrana gönderilen parametrelere göre bildirim bastırır

    removeFromLocalStorage(id)
}

const editItem = (e) => {
    const element = e.target.parentElement.parentElement.parentElement
    editElement = e.target.parentElement.parentElement.previousElementSibling // Düzenleme yapılacak etiketi seçer
    grocery.value = editElement.innerText // Düzenlenen etiketin içeriği inputa aktarılır 
    editFlag = true
    editID = element.dataset.id // Düzenlenen öğenin kimliğini gönderir
    submitBtn.textContent = "Edit" // Düzenle ikonuna tıklanıldığında ekle butonu düzenle olarak değişir
    console.log(editID)
}

const clearItems = () => {
    const items = document.querySelectorAll(".grocery-item")
    // Listede article etiketi var mı
    if (items.length > 0) {
        items.forEach((item) => list.removeChild(item)) // forEach ile dizi içerisinde bulunan her bir elemanı dönüp her bir öğeyi listeden kaldırır
    }
    displayAlert("the List is Empty", "danger")
}

// Yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
    const grocery = { id, value }
    let items = getLocalStorage()
    items.push(grocery)
    console.log(items)
    localStorage.setItem("list", JSON.stringify(items))
}

// Yerel depodan öğeleri alma işlemi
function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : []
}

// Yerel depodan id ye göre silme işlemi
const removeFromLocalStorage = (id) => {
    let items = getLocalStorage()
    items = items.filter((item) => item.id !== id)
    localStorage.setItem("list", JSON.stringify(items))
}

const editLocalStore = (id, value) => {
    let items = getLocalStorage()

    items = items.map((item) => {
        if (item.id === id) {
            item.value = value
        }
        return item
    })
    console.log(items)
    localStorage.setItem("list", JSON.stringify(items))
}

//? Gönderilen id ve value(değer) sahip bir öğe oluşturan fonksiyon
const createListItem = (id, value) => {
    const element = document.createElement("article") // Yeni bir article öğesi oluştur
    let attr = document.createAttribute("data-id") // Yeni bir veri kimliği oluştur
    attr.value = id
    element.setAttributeNode(attr) // Oluşturulan idy i data özellik olarak set eder
    element.classList.add("grocery-item") // article etiketine class ekler

    element.innerHTML = `
          <p class="title">${value}</p>
          <div class="btn-container">
              <button type="button" class="edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                  <i class="fa-solid fa-trash"></i>
              </button>
          </div>
      `
    // Oluşturulan bu butonlara olay izleyicileri eklemek için seçeriz
    const deleteBtn = element.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", deleteItem)
    const editBtn = element.querySelector(".edit-btn")
    editBtn.addEventListener("click", editItem)
    list.appendChild(element) // Oluşturulan article etiketini htmle ekler
}

const setupItems = () => {
    let items = getLocalStorage()

    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value)
        })
    }
}


//! Olay İzleyicileri

//? Form gönderildiğinde addItem foksiyonu çalışır
form.addEventListener("submit", addItem)
clearBtn.addEventListener("click", clearItems)
window.addEventListener("DOMContentLoaded", setupItems)
