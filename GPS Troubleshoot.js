
const searchInput = document.getElementById("searchInput")

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase()

    const items = document.querySelectorAll(".accordion-item")

    items.forEach(item => {

        const text = item.innerText.toLowerCase()

        if (text.includes(value)) {
            item.style.display = ""
        }
        else {
            item.style.display = "none"
        }

    })

})