// Storage Controller


// Item Controller
const ItemCtrl = (function(){
   // Item Constructor
   const Item = function(id, name, calories){
       this.id = id;
       this.name = name;
       this.calories = calories;
   }

   //Data Structure - State
   const data = {
       items: [
        // Initial hard code data used to help biult the app is now commented 
        //    {id:0, name: 'Steak Dinner', calories: 1200},
        //    {id:1, name: 'Cookie', calories: 400},
        //    {id:2, name: 'Eggs', calories: 300}
       ],
       currentItem: null,
       totalCalories: 0
   }

   // Public methods
   return {
       getItems: function(){
           return data.items;
       },
       addItem: function(name, calories){
        let ID;
        // Generate ID
        if(data.items.length > 0){
            ID = data.items[data.items.length - 1].id + 1;
        } else {
            ID = 0;
        }

        // Calories (input as string) to number
        calories = parseInt(calories);

        // Create new Item
        newItem = new Item(ID, name, calories);

        // Add to items array
        data.items.push(newItem);

        return newItem;
       },
       getItemById: function(id){
            // Loop through items to find the selected id
        
            // let idFound = null;
            // data.items.forEach(item =>{
            //     if(item.id === id){
            //         idFound = item;
            //     }
            // })
            // return idFound;

            let idFound = data.items.find(item => {
                return item.id === id
            })
            return idFound;
       },
       updateItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);

            let itemFound = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    itemFound = item;
                }
            });

            return itemFound;
       },
       setCurrentItem: function(item){
            data.currentItem = item;
       },
       getCurrentItem: function(){
           return data.currentItem;
       },
       getTotalCalories: function(){
           let total = 0;

           // Loop through items and add calories
           data.items.forEach(item => {
               total += item.calories;
           })

           // Set total of calories in data structure
           data.totalCalories = total;

           // Return total
           return data.totalCalories;
       },
       logData: function(){
           return data;
       }
   }
})();



// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public methods
    return{
        populateItemList: function(items){
            let html = '';

            items.forEach(item => {
                html += `<li class='collection-item' id='item-${item.id}'> 
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em> 
                            <a href='#' class='secondary-content'> 
                                <i class='edit-item fa fa-pencil'></i> 
                            </a>
                        </li>`;

            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em> 
                            <a href='#' class='secondary-content'> 
                            <i class='edit-item fa fa-pencil'></i> 
                            </a>`
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Convert Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML =
                    `<strong>${item.name}: </strong> <em>${item.calories} Calories</em> 
                    <a href='#' class='secondary-content'><i class='edit-item fa fa-pencil'></i></a>`;
                }

            });
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
        getSelectors: function(){
            return UISelectors;
        }
    }
   
})();



// App Controller
const AppCtrl = (function(ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event- Select the list ID itself as the icon is generated dinamically by JS
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Update item event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
           // Add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);

           // Add item to UI list
           UICtrl.addListItem(newItem);

           // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

           // Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

           // Clear fields
           UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array        console.log('update')
            const listIdArray = listId.split('-');

            // Get the actual id
            const id = parseInt(listIdArray[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }
        
        e.preventDefault();
    }

    const itemUpdateSubmit = function(e){
        // get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Clear edit state
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Public methods
    return {
        init: function(){
            // Set to initial state - Clear edit state
            UICtrl.clearEditState();
            
            // Fetch items from data structure (Item Controller)
            const items = ItemCtrl.getItems();

            // Check if there are any items
            if(items.length === 0){
                UICtrl.hideList();
            } else {
            // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

           // Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
   
})(ItemCtrl, UICtrl);

AppCtrl.init();