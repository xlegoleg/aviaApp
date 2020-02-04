import api from '../services/apiService';
import {formatDate} from '../helpers/date';
import { setDayWithOptions } from 'date-fns/fp';

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.airlines = null;
    this.autocompleteFormatList = null;
    this.lastSearch = null;
    this.formatDate = helpers.formatDate;
  }

  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
    ]);

    const [countries,cities,airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.airlines = this.serializeAirlines(airlines);
    this.autocompleteFormatList = this.createAutocompleteFormatList(this.cities);
    return response;
  }

  createAutocompleteFormatList(cities) {
    return Object.values(cities).reduce((acc, city) => {
      acc[city.full_name] = null;
      return acc;
    },{})
  }

  serializeCountries(countries) {
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    },{});
  }

  serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const country_name = this.countries[city.country_code].name;
      city.name = city.name || city.name_translations.en;
      const full_name = `${city.name},${country_name}`;
      acc[city.code] = {
        ...city,
        country_name,
        full_name,
      };
      return acc;
    },{});
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc,airline) => {
      airline.logo = `http://pics.avs.io/100/50/${airline.code}.png`;
      airline.name = airline.name || airline.name_translations.en;
      acc[airline.code] = airline;
      return acc;
    }, {});
  }

  getCodeByCity(key) {
    const city = Object.values(this.cities).find(item => item.full_name === key);
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  getCountryNameByCode(code) {
    return this.countries[code].name; 
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }

  getCurrencyIcon(currency) {
    switch(currency){
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
    };
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response);
  }

  serializeTickets(tickets) {
    
    return Object.values(tickets.data).map((ticket) => {
      return {
        ...ticket,
        currency: this.getCurrencyIcon(tickets.currency),
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_time: this.formatDate(ticket.departure_at,'hh:mm'),
        return_time: this.formatDate(ticket.return_at,'hh:mm'),
        departure_at: this.formatDate(ticket.departure_at,'dd MMM yyy'),
        return_at: this.formatDate(ticket.return_at,'dd MMM yyy'),
      }
    })
  }
}


const locations = new Locations(api, {formatDate});

export default locations;