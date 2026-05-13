<!-- page 1 (Home Page)-->

# List of all city (GET)
> http://localhost:7000/location
# List of all restaurants(GET)
# Restaurants wrt city (GET) 
> http://localhost:7000/restaurants?stateId=1
# List of all meal (GET)
> http://localhost:7000/mealTypes

<!-- page 2 (Listing Page)-->

# Restaurants wrt mealTypes (GET)
> http://localhost:7000/restaurants?mealsTypes=3
# List of Restaurants wrt mealTypes + cuisine(GET) 
> http://localhost:7000/restaurants?mealsTypes=1&cuisine=1
> http://localhost:7000/restaurants?mealsTypes=1&cuisine=3
# List of Restaurants wrt mealTypes + cost (GET)
> http://localhost:7000/restaurants?mealsTypes=1&lcost=500&hcost=1000
# Sort on basis of price (GET)
> http://localhost:7000/restaurants?sortKey=cost&sortOrder=1
> http://localhost:7000/restaurants?mealsTypes=1&cuisine=1&lcost=500&hcost=1000&sortKey=cost&sortOrder=1
# Pagination(GET)
> http://localhost:7000/restaurants?&sortKey=cost&sortOrder=1&skip=3&limit=3
<!-- page 3 (Details Page)-->

# Details of Restaurants wrt ID (GET)
> http://localhost:7000/restaurants/1
# Menu wrt Restaurants(GET)

<!-- page 4 -->

# Details of Selected Items (post)
# Place the order (post)

<!-- page 5-->

# List of order wrt emails(GET)
# update the order status(Put)
# Delete orders(Delete)
  