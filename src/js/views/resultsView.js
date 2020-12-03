import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipes found for your query! please try again.';
  _message = '';
  
  _generateMarkup() {
    return this._data.map(bookmark=>previewView.render(bookmark,false)).join('');
    
  }
  
}

export default new ResultsView();
