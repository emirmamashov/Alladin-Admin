function setCategory() {
    var selCategoryElem = document.getElementById("categorySel");
    var category = document.getElementById("category");
    category.value = selCategoryElem[selCategoryElem.selectedIndex].value;
}