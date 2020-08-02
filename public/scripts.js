// const modalOverlay = document.querySelector('.modal-overlay');
// const cards  = document.querySelectorAll('.card');

// for (let card of cards){
//     card.addEventListener("click", function(){
//         const videoId = card.getAttribute("id");
//         window.location.href = `/video/?id=${videoId}`;
//     })
// }

// document.querySelector('.close-modal').addEventListener("click", function(){
//     modalOverlay.classList.remove('active');
//     modalOverlay.querySelector("iframe").src="";
// })



const currentPage = location.pathname;

const menuItems = document.querySelectorAll("header .links a");

for (item of menuItems){
    
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active");
    }
}

function paginate(selectedPage, totalPages) {
    let pages = [],
    oldPage


    for (let currentPage = 1 ; currentPage <= totalPages; currentPage++){
    
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;
    
    if (firstAndLastPage == 1 || pagesAfterSelectedPage && pagesBeforeSelectedPage){
        

        if (oldPage && currentPage - oldPage >2 ) {
            pages.push("...");
        }

        if (oldPage && currentPage - oldPage == 2 ){
            pages.push(oldPage + 1);
        }
        pages.push(currentPage);
        oldPage = currentPage;

    }

    }
    return pages;
    
}


function createPagination(pagination){

    
    const page = pagination.dataset.page;
    const total = pagination.dataset.total;
    const filter = pagination.dataset.filter;
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements+= `<span>${page}</${page}>`
        } else {
            if ( filter ) {
                elements+= `<a href="?page=${page}&filter=${filter}">${page}</a>` 
            } else {
                elements+= `<a href="?page=${page}">${page}</a>`    
        
            }   

        }
    }

    pagination.innerHTML = elements

}

const pagination = document.querySelector(".pagination");

if (pagination) {
    createPagination(pagination);
}
