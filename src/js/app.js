import '../css/style.css';
import './plugins';
import locations from './store/locations';
import formUI from './views/form';
import currencyUI from './views/currency';
import ticketsUI from './views/tickets';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const form = formUI.form;
//Events
  
  form.addEventListener('submit' ,(e) => {
    e.preventDefault();
    onFormSubmit();
  });

//Handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.autocompleteFormatList);
  }

  async function onFormSubmit() {
    const origin = locations.getCodeByCity(formUI.originValue);
    const destination = locations.getCodeByCity(formUI.destinationValue);
    const depart_date = formUI.departValue;
    const return_date = formUI.returnValue;
    const currency = currencyUI.currencyValue;
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });
    console.log(locations.lastSearch);
    ticketsUI.renderTickets(locations.lastSearch);
  }

});