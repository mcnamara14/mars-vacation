
// const addItem = (item) => {
//   const itemsContainer = document.querySelector('.items-container');
//   const article = document.createElement('article');
//   const itemHeader = document.createElement('div');
//   const packedCheckbox = document.createElement('div');
//   const checkbox = document.createElement('input');
//   const packed = document.createElement('p');
//   itemHeader.className = 'item-header'
//   article.className = 'item-box';
//   article.id = item.id;
//   const name = document.createElement('h2');
//   const button = document.createElement('button');
//   const buttonText = document.createTextNode('Delete');
//   button.appendChild(buttonText);
//   name.innerHTML = item.name;
//   article.prepend(itemHeader);
//   packedCheckbox.prepend(checkbox);
//   packedCheckbox.prepend(packed);
//   itemHeader.prepend(name);
//   itemHeader.prepend(button);
//   projects.prepend(article);
// }

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

    retreiveFromDb(itemId)
}

const retreiveFromDb = async (id) => {
  const response = await fetch(`/api/v1/items/${id}`)
  const data = await response.json();
  const item = data[0];

  console.log(item)
}



const addItemBtn = document.querySelector('.add-item-btn');
addItemBtn.addEventListener('click', addItemToDb)