"use strict";

const socket = io();

const flight_origin = document.getElementById("flight-origin");
const flight_destination = document.getElementById("flight-destination");
const flight_departure = document.getElementById("flight-departure");
const flight_return = document.getElementById("flight-return");
const flight_adults = document.getElementById("flight-adults");
const flight_children = document.getElementById("flight-children");
const flight_infants = document.getElementById("flight-infants");
const flight_class = document.getElementById("flight-class");
const flight_search_btn = document.getElementById("flight-search-btn");

const hotel_city = document.getElementById("hotel-city");
const hotel_adults = document.getElementById("hotel-adults");
const hotel_checkin = document.getElementById("hotel-checkin");
const hotel_checkout = document.getElementById("hotel-checkout");
const hotel_rooms = document.getElementById("hotel-rooms");
const hotel_search_btn = document.getElementById("hotel-search-btn");

const activity_city = document.getElementById("activity-city");
const activity_radius = document.getElementById("activity-radius");
const activity_search_btn = document.getElementById("activity-search-btn");
const pois_search_btn = document.getElementById("pois-search-btn");	


const back_btn = document.getElementById("back-home");
back_btn.addEventListener("click", () => {
	window.location.href = "../index.html";
});

flight_search_btn.addEventListener("click", () => {
	const params = {
		origin: flight_origin.value,
		destination: flight_destination.value,
		departure: flight_departure.value,
		return: flight_return.value,
		adults: flight_adults.value,
		children: flight_children.value,
		infants: flight_infants.value,
		class: flight_class.value
	};

	socket.emit("flight-search", params);
});

hotel_search_btn.addEventListener("click", () => {
	const params = {
		city: hotel_city.value,
		adults: hotel_adults.value,
		checkin: hotel_checkin.value,
		checkout: hotel_checkout.value,
		rooms: hotel_rooms.value
	};

	socket.emit("hotel-search", params);
});

activity_search_btn.addEventListener("click", () => {
	const params = {
		city: activity_city.value,
		radius: activity_radius.value
	};

	socket.emit("activity-search", params);
});

pois_search_btn.addEventListener("click", () => {
	const params = {
		city: activity_city.value,
		radius: activity_radius.value
	};

	socket.emit("pois-search", params);
});