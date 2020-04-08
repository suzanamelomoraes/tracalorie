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
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
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

           // Clear fields
           UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Public methods
    return {
        init: function(){
            // Fetch items from data structure (Item Controller)
            const items = ItemCtrl.getItems();

            // Check if there are any items
            if(items.length === 0){
                UICtrl.hideList();
            } else {
            // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Load event listeners
            loadEventListeners();
        }
    }
   
})(ItemCtrl, UICtrl);

AppCtrl.init();