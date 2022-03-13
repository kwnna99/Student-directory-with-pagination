const itemsPerPage=9;

/**
 * Creates an element and optionally adds a class to it. Then appends it to the parent
 * @param {string} item The HTML of the item to create
 * @param {string} itemType The element tagName (lowercase)
 * @param {Element} parent The parent element to which we will append the item
 * @param {string} itemClass The string with the classes to be added to the child element
 * @returns the child element created
 */
function createAndAppendChild(item,itemType,parent,itemClass=null){
  let child=document.createElement(itemType);
  child.innerHTML=item;
  if(itemClass!=null){
    child.className=itemClass;
  }
  parent.appendChild(child);
  return child;
}

/**
 * Displays a page of itemsPerPage (number) students. The constant determines the number of students shown and is declared globally
 * @param {array} list an array of student objects
 * @param {integer} page the number of the page to show
 */
function showPage(list,page){
  let studentList=document.querySelector('.student-list');
  studentList.innerHTML='';
  //if there are students to show
  if(list.length>0){
    let startIndex = (((page* itemsPerPage) - itemsPerPage)<0) ? 0: ((page* itemsPerPage) - itemsPerPage);
    let endIndex = ((page* itemsPerPage)>=list.length) ? list.length : page* itemsPerPage;
    var itemHTML=``;
    for(let i=startIndex; i<endIndex; i++){
      itemHTML=`<div class="student-details"><img class="avatar" src="${list[i]['picture']['large']}" alt="Profile Picture">
      <h3>${list[i]['name']['first']} ${list[i]['name']['last']}</h3><span class="email">${list[i]['email']}</span>
    </div><div class="joined-details"><span class="date">Joined ${list[i]['registered']['date']}</span></div>`;
      createAndAppendChild(itemHTML,'li',studentList,'student-item cf');
    }
  }else{
    //show message that no students were found
    studentList.innerHTML='<h2>No results found</h2>';
  }
}

/**
 * Creates the pagination buttons shown below the students' profile cards and adds on click functionality to change the displayed students
 * @param {array} list an array of student objects
 */
function addPagination(list){
  const pagination=document.querySelector('.link-list');
  const paginationItems=Math.ceil(list.length/itemsPerPage);
  pagination.innerHTML='';
  //add pagination only if more than 1 pages are present; no need to display pagination for 1 page
  if(paginationItems>1){
    var itemHTML='';
    for(let i=1; i<=paginationItems;i++){
      itemHTML=`<button type="button">${i}</button>`;
      if(i==1){
        itemHTML=`<button type="button" class="active">${i}</button>`;
      }else{
        itemHTML=`<button type="button">${i}</button>`;
      }
      createAndAppendChild(itemHTML,'li',pagination);
    }

    pagination.addEventListener('click',(e)=>{
      const targetElement=e.target;
      //catch only the events done in the buttons of the specified UL
      if (targetElement.tagName==='BUTTON'){
        document.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');
        showPage(list,e.target.textContent);
      }
    });
  }
}

/**
 * Uses a regular expression to search on the users' first name and last name and create a filtered array with only the users who match the string (case insensitive)
 * @param {string} input the user inputted string
 * @param {array} list an array of student objects
 */
function handleSearch(input,list){
  let matches=[];
  var re = new RegExp(input,'i');
  for(let i=0; i<list.length; i++){
    if(re.test(list[i]['name']['first']) || re.test(list[i]['name']['last']) ){
      matches.push(list[i]);
    }
  }
  addPagination(matches);
  showPage(matches,1);
}

/**
 * Adds the search bar at the predefined location and implements an eventListener on keyup to check and trigger search results
 * @param {array} studentList An array of student objects
 */

function addSearchBar(studentList){
  const searchBar=createAndAppendChild(`<span>Search by name</span>
  <input id="search" placeholder="Search by name...">
  <button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>`,'label',document.querySelector('.header'),'student-search');
  const searchInput=document.querySelector('.student-search');
  searchBar.htmlFor='search';
  searchInput.addEventListener('keyup',(e)=>{
    handleSearch(e.target.value, studentList);
  });
}

// Call functions
showPage(data,1);
addPagination(data);
addSearchBar(data);
