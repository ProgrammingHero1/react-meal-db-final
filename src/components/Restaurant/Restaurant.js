import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Meal from '../Meal/Meal';
import OrderList from '../OrderList/OrderList';
import './Restaurant.css';

const Restaurant = () => {
    const [meals, setMeals] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=fish')
            .then(res => res.json())
            .then(data => setMeals(data.meals));
    }, []);
    /* 
        The above api link or the below method will now work for search. 
        if you want to implement search in this code. 
        1. add a input field 
        2. declare a state to keep search field text
        3. Make meal loading api to dependant on search text
        4. change the meal loading api.you will get the right api link on their website.
        5. make the meal loading api dynamic using template string. 
        6. Also, the useEffect below will not work. Because, search result might not include the meals previously added to the cart
        7. in that case, for each mealId, you have to load the meal from the api (you will find a new pai to load meal by Id) and then add them to the order state.
        ---------------  
        Read carefully, give it a try. [ Ki ache jibone]
        if  you need help, let us know in the support session
    */

        useEffect( () =>{
            const storedOrder = getStoredCart();
            const savedOrder = [];

            for(const id in storedOrder){
                const addedMeal = meals.find(meal => meal.idMeal === id);
                if(addedMeal){
                    const quantity = storedOrder[id];
                    addedMeal.quantity = quantity;
                    savedOrder.push(addedMeal);
                }
            }
            setOrders(savedOrder);
        }, [meals])
    
    const handleAddToOrder = meal =>{
        let newOrders = [];
        const exists = orders.find(m => m.idMeal === meal.idMeal);
        if(exists){
            const rest = orders.filter(m => m.idMeal !== meal.idMeal);
            exists.quantity = exists.quantity + 1;
            newOrders= [...rest, exists];
        }
        else{
            meal.quantity = 1;
            newOrders = [...orders, meal];
        }
        
        setOrders(newOrders);
        addToDb(meal.idMeal);
    }


    return (
        <div className="restaurant-menu">
            <div className="meals-container">
                {
                    meals.map(meal => <Meal
                        key={meal.idMeal}
                        meal={meal}
                        handleAddToOrder={handleAddToOrder}
                    ></Meal>)
                }
            </div>
            <div className="order-list">
                <OrderList orders={orders}></OrderList>
            </div>
        </div>

    );
};

export default Restaurant;