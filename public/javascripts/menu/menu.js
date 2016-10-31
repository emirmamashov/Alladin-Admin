function addSubMenu() {
    var countSubMenus = document.getElementById("countSubmenus");
    var subMenuParent = document.getElementById("subMenuParent");
    var subMenu = document.getElementById("subMenu1");

    if (!subMenu || !subMenuParent || !countSubMenus) {
        console.log("ERROR! subMenu: "+subMenu+
            " subMenuParent: "+subMenuParent+
            " countSubMenus: "+countSubMenus + "->line: 9; ->fileUrl: javascripts/menu.js");
        alert("Приносим извенение! мы не нашли элемента subMenu1. Обратитесь к разработчикам...");
        return;
    }

    if (!subMenu.children[0].children[0] || subMenu.children[0].children[0].value == "" || subMenu.children[0].children[0].value == " ") return;

    var prevSubMenu = document.getElementById("subMenu"+countSubMenus.value);
    if(prevSubMenu != subMenu) {
        if (!prevSubMenu.children[1].children[0] || prevSubMenu.children[1].children[0].value == "" || prevSubMenu.children[1].children[0].value == " ") return;
    }

    var indexMenu = parseInt(countSubMenus.value)+1;
    countSubMenus.value = indexMenu;
    var subMenuNew = subMenu.cloneNode(true);
    subMenuNew.id="subMenu"+indexMenu;
    subMenuNew.children[0].children[0].value="";

    var div = document.createElement("div");
    div.id="actionsSubmenu"+indexMenu;
    //var span = document.createElement("span");
    //span.className="btn btn-link";
    //span.onclick="removeSubMenu('subMenu'"+indexMenu+")";
    //span.innerHTML
    div.innerHTML = '<span class="btn btn-link" onclick="removeSubMenu(\'subMenu'+indexMenu+'\')">Удалить</span>';
    subMenuNew.insertBefore(div, subMenuNew.childNodes[0]);
    subMenuParent.append(subMenuNew);
}

function removeSubMenu(id) {
    var subMenu = document.getElementById(id);
    if(!subMenu) return false;
    var subMenuParent = document.getElementById("subMenuParent");
    subMenuParent.removeChild(subMenu);
    var countSubMenus = document.getElementById("countSubmenus");
    if(countSubMenus.value > 1) countSubMenus.value = parseInt(countSubMenus)-1;
}