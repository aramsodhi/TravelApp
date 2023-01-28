"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 8000;
const path = require("path");
const colors = require("colors");
const io = require("socket.io")(server);

const fs = require("fs");

require("dotenv").config();

/*
TO DO:
- check data types for params
- build rental car, activities, and restaurant data retrieval functions
- filter data and present in way that is easy to interpret
*/


// documentation in links below
// https://github.com/amadeus4dev/amadeus-node
// https://developers.amadeus.com/self-service/category/hotel/api-doc/hotel-search/api-reference
const Amadeus = require("amadeus");
const amadeus = new Amadeus({
	clientId: process.env.AMADEUS_CLIENT_ID,
	clientSecret: process.env.AMADEUS_CLIENT_SECRET
});
console.log("AMADEUS INITIALIZED".cyan);

app.use(express.static(path.join(__dirname + "/public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

io.on("connection", (socket) => {
	console.log("user has connected".yellow);

	socket.on("flight-search", (params) => {
		console.log("SEARCHING FLIGHTS".blue);
		(async () => {
			const flight_offer = await get_flight_data(params);
			await console.log(flight_offer);

			await console.log("SEARCHING FLIGHT PRICES".blue);
			const price = await flight_offer_price(flight_offer);
			await console.log(price);
		})();
	});

	socket.on("hotel-search", (params) => {
		console.log("SEARCHING HOTELS".blue);
		(async () => {
			const hotel_offers = await get_hotel_data(params);
			await console.log(hotel_offers);
		})();
	});

	socket.on("activity-search", (params) => {
		console.log("SEARCHING ACTIVITIES".blue);
		(async () => {
			const activity_offers = await get_activity_data(params);
			await console.log(activity_offers);
		})();
	});


	socket.on("pois-search", (params) => {
		console.log("SEARCHING POINTS OF INTEREST".blue);
		(async () => {
			const pois_offers = await get_points_of_interest(params);
			await console.log(pois_offers);
		})();
	});

	socket.on("disconnect", () => {
		console.log("user has disconnected".red);
	});
});

server.listen(PORT, () => console.log(`running on port ${PORT}`.magenta));


async function get_flight_data(params) {
	/*
	Returns a list of flights available (probably end up going with 5 or 10)
	More specifically, it returns a list of objects, each object formatted like below:

	flights[i] = {
		base: price in currency,
		total: base + fees in currency,
		currency: eur, cad, usd, etc.,
		airline: [name, code],
		departure: when does the flight depart,
		arrival: when does it arrive at final destination,
		itinerary: array of stops,
		stops: itinerary.length - 2 (if = 0 then it is direct),
		duration: time between depature and arrival adjusted to one time zone

		origin: origin,
		destination: destination,
		adults: adults,
		children: children:
		infants: infants:
		class: flight class
		more things...
	}
	*/

	if (params.return) {
		try {
			const response = await amadeus.shopping.flightOffersSearch.get({
				originLocationCode: params.origin,
				destinationLocationCode: params.destination,
				departureDate: params.departure,
				returnDate: params.returnDate,
				adults: params.adults,
				children: params.children,
				infants: params.infants,
				travelClass: params.travelClass,
				maxPrice: params.maxPrice,
				max: 5
			});	

			return response.data[0];

		} catch(err) {
			console.log(err);
		}

	} else {
		try {
			const response = await amadeus.shopping.flightOffersSearch.get({
				originLocationCode: params.origin,
				destinationLocationCode: params.destination,
				departureDate: params.departure,
				adults: params.adults,
				children: params.children,
				infants: params.infants,
				travelClass: params.travelClass,
				maxPrice: params.maxPrice,
				max: 5
			});

			return response.data[0]

		} catch(err) {
			console.log(err);
		}

	}
} 

async function get_hotel_data(params) {
	try {
		const response = await amadeus.shopping.hotelOffers.get({
			cityCode: params.city,
			adults: params.adults,
			checkInDate: params.checkin,
			checkOutDate: params.checkout,
			roomQuantity: params.rooms,
			max: 3
		});

		return response.data;
	
	} catch(err) {
		console.log(err);
	}
}


async function get_activity_data(params) {
	try {
		const latlong = await get_lat_long(params.city);
		const lat = latlong[0];
		const long = latlong[1];

		console.log(lat, long);

		const response = await amadeus.shopping.activities.get({
			latitude: lat,
			longitude: long,
			radius: params.radius,
			max: 10
		});

		return response.data;

	} catch(err) {
		console.log(err);
	}
}

async function get_lat_long(cityCode) {
	try {
		const response = await amadeus.referenceData.locations.get({
			keyword: cityCode,
			subType: Amadeus.location.any
		});

		const lat = await response.data[0].geoCode.latitude;
		const long = await response.data[0].geoCode.longitude;

		return [lat, long];

	} catch(err) {
		console.log(err);
	}
}


async function get_points_of_interest(params) {
	try {
		const latlong = await get_lat_long(params.city);
		const lat = latlong[0];
		const long = latlong[1];
		console.log(latlong);

		const response = await amadeus.referenceData.locations.pointsOfInterest.get({
			latitude: lat,
			longitude: long,
			radius: params.radius,
			max: 10
		});

		return response.data;
	} catch(err) {
		console.log(err);
	}
}


async function flight_offer_price(offer) {
	try {
		const response = await amadeus.shopping.flightOffers.pricing.post(JSON.stringify(
			{
				"data": {
					"type": "flight-offers-pricing",
					"flightOffers": [offer]
				}
			})
		);

		return response.data;
	} catch(err) {
		console.log(err);
	}
}


async function hotel_offer_price(offer) {
	try {
		void(0);
	} catch(err) {
		console.log(err);
	}
}


async function book_flight(params) {
	try {
		void(0);
	} catch(err) {
		console.log(err);
	}
}