import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {MODEL_CLOSE_SEC} from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/PaginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
const { async } = require('q');

const controlRecipes = async function () {
  try {
    const id =window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();

    //update results view to mark selected search results
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    //1)loading Recipe

    await model.loadRecipe(id);

    //2)rendring recipe
    recipeView.render(model.state.recipe);
    
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if(!query) return;

    //Load search result
    await model.loadSearchResults(query);

    //render Results
    resultsView.render(model.getSearchResultPage());

    //render the initial pagination buttons
    paginationView.render(model.state.search);
  }catch(err){
    console.log(err);
  }
};

const controlPagination =function(goToPage){
  //render New Results
  resultsView.render(model.getSearchResultPage(goToPage));

  //render New pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //update Recipe Servings (in state)
  model.updateServings(newServings);
  //update Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark =function(){
  //Add/remove bookMark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  try{
    //Show loading Spinner
    addRecipeView.renderSpinner();
    
    //upload the new Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);


    //close Form Window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODEL_CLOSE_SEC * 1000);
  }catch(err){
    //console.log(err);
    addRecipeView.renderError(err);
  }
  //upload new recipe data
}

const init =function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();