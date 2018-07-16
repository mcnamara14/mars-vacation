const addAllItemsToPage = async () => {
  const response = await fetch('/api/v1/items/');
  const items = await response.json();

  items.forEach(item => {
    addItemToPage(item);
  });
};

const addItemToDb = async () => {
  const name = document.querySelector('.item-input').value;

  const response = await fetch('/api/v1/items',
    {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ name })
    });
  const data = await response.json();
  const itemId = data.id;

  getDeleteBtns();
  getCheckboxes();
  retreiveFromDb(itemId);
};

const retreiveFromDb = async (id) => {
  const response = await fetch(`/api/v1/items/${id}`);
  const data = await response.json();
  const item = data[0];

  addItemToPage(item);
};

const addItemToPage = (item) => {
  const itemsContainer = document.querySelector('.items-container');
  const article = document.createElement('article');
  const itemHeader = document.createElement('div');
  const packedCheckbox = document.createElement('div');
  const checkbox = document.createElement('input');
  const packed = document.createElement('p');
  checkbox.setAttribute("type", "checkbox");
  checkbox.className = 'packed-item-checkbox';
  packed.innerHTML = 'Packed';
  itemHeader.className = 'item-header';
  packedCheckbox.className = 'packed-checkbox';
  article.className = 'item-box';
  article.id = item.id;
  const name = document.createElement('h2');
  const button = document.createElement('button');
  const buttonText = document.createTextNode('Delete');
  button.appendChild(buttonText);
  name.innerHTML = item.name;
  article.prepend(packedCheckbox);
  article.prepend(itemHeader);
  packedCheckbox.prepend(packed);
  packedCheckbox.prepend(checkbox);
  itemHeader.prepend(button);
  itemHeader.prepend(name);
  itemsContainer.prepend(article);

  if (item.packed === true) {
    checkbox.checked = true;
  }
};

const updatePacked = async (e) => {
  const checkbox = e.target;
  const item = checkbox.closest('.item-box');
  const id = item.getAttribute('id');
  
  checkbox.classList.toggle('packed');

  if (checkbox.classList.contains('packed')) {
    await fetch(`/api/v1/items/${id}`, 
      { 
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({ "packed": true })
      });  
  } else {
    await fetch(`/api/v1/items/${id}`, 
      { 
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({ "packed": false })
      });       
  }
};

const getCheckboxes = () => {
  setTimeout(function() { 
    const packedCheckboxes = document.querySelectorAll('.packed-item-checkbox');
    packedCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => updatePacked(e));
    });
  }, 500);
}
;
const deleteItem = async (e) => {
  const button = e.target;
  const item = button.closest('.item-box');
  const id = item.getAttribute('id');

  await fetch(`/api/v1/items/${id}`, {method: 'DELETE'});
  item.remove();
};

const getDeleteBtns = () => {
  setTimeout(function() { 
    const deleteBtns = document.querySelectorAll('button');
    deleteBtns.forEach(button => {
      button.addEventListener('click', (e) => deleteItem(e));
    });
  }, 500);  
};

const addItemBtn = document.querySelector('form');
addItemBtn.addEventListener('submit', addItemToDb);

getDeleteBtns();
getCheckboxes();
addAllItemsToPage();