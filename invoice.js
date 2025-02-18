"use strict";

const calculateDiscount = (customer, subtotal) => {
	if (customer == "reg") {
		if (subtotal >= 100 && subtotal < 250) {
			return 0.1;
		} else if (subtotal >= 250 && subtotal < 500) {
			return 0.25;
		} else if (subtotal >= 500) {
			return 0.3;
		} else {
			return 0;
		}
	} else if (customer == "loyal") {
		return 0.3;
	} else if (customer == "honored") {
		if (subtotal < 500) {
			return 0.4;
		} else {
			return 0.5;
		}
	}
};

/**
 * Function that format a date object to MM/DD/YYYY
 * @param {*} dateToFormat
 * @returns
 */
const formatDate = (dateToFormat) => {
	const date = new Date(dateToFormat);

	let month = date.getMonth() + 1;
	month = month.toString().padStart(2, "0");
	let day = date.getDate();
	day = day.toString().padStart(2, "0");
	let year = date.getFullYear();
	const dateFormatted = month + "/" + day + "/" + year;
	return dateFormatted;
};

/**
 * Function that validates the invoice date that the user entered.
 * @returns
 */
const validationInvoiceDate = (invoiceDate) => {
	// Validates invoice date has two slashes
	const invoiceDateSplit = invoiceDate.split("/");
	if (invoiceDateSplit.length != 3) {
		alert("Please enter the date in MM/DD/YYYY format.");
		return false;
	}
	if (new Date(invoiceDate) == "Invalid Date") {
		alert("Please enter the date in MM/DD/YYYY format.");
		return false;
	}

	// Variables for month and day validation
	const monthInvoiceDate = invoiceDateSplit[0];
	const dayInvoiceDate = invoiceDateSplit[1];
	const yearInvoiceDate = invoiceDateSplit[2];
	// Validates if month value is a number between 1 and 12.
	if (
		isNaN(monthInvoiceDate) ||
		monthInvoiceDate < 1 ||
		monthInvoiceDate > 12
	) {
		alert(
			"Please enter a valid month. Value should be a number between 1 and 12."
		);
		return false;
	}
	// Stores the last day of the month.
	const lastDayOfMonth = new Date(
		yearInvoiceDate,
		monthInvoiceDate,
		0
	).getDate();

	// Validates if the day is a number between 1 and the last day of the month.
	if (
		isNaN(dayInvoiceDate) ||
		dayInvoiceDate < 1 ||
		dayInvoiceDate > lastDayOfMonth
	) {
		alert(
			"Please enter a valid day. Value should be a number between 1 and " +
				lastDayOfMonth +
				"."
		);
		return false;
	}

	// Validates that invoice date has a 4-digit year.
	const year = invoiceDate.substring(invoiceDate.length - 4);
	if (isNaN(year)) {
		alert("Please enter the date in MM/DD/YYYY format.");
		return false;
	}

	// Validates that invoice date is a valid date.
	let date = new Date(invoiceDate);
	if (date == "Invalid Date") {
		alert("Please enter the date in MM/DD/YYYY format.");
		return false;
	}

	return true;
};

$(document).ready(() => {
	// Variable that will help to determine if customer type and invoice subtotal should be clear.
	let clearFirstTwo = true;
	$("#calculate").click(() => {
		const customerType = $("#type").val();
		let subtotal = $("#subtotal").val();
		subtotal = parseFloat(subtotal);
		// Get the value of the invoice date input
		const invoiceDate = $("#invoice_date").val();
		// Variable that will store the invoice date converted to a Date Object.
		let invoiceDateObject;
		// Variable that will store the value of the invoice date formatted in MM/DD/YYYY
		let invoiceDateFormatted;
		if (isNaN(subtotal) || subtotal <= 0) {
			alert("Subtotal must be a number greater than zero.");
			$("#clear").click();
			$("#subtotal").focus();
			return;
		}

		// Validates user entered invoice date, if not, invoice date will be the current date.
		if (!invoiceDate) {
			invoiceDateFormatted = formatDate(new Date());
			invoiceDateObject = new Date();
		} else {
			// Call to the function that will validates the invoice date that the user entered.
			if (!validationInvoiceDate(invoiceDate)) {
				clearFirstTwo = false;
				$("#clear").click();
				$("#invoice_date").focus();
				return;
			}
			invoiceDateObject = new Date(invoiceDate);
			invoiceDateFormatted = formatDate(invoiceDateObject);
		}
		// Variable that will store the due date object that is the invoice date plus 30 days.
		let dueDateObject = new Date(invoiceDateObject);
		dueDateObject = dueDateObject.setDate(invoiceDateObject.getDate() + 30);
		// Variable that will store the value of the due date formatted in MM/DD/YYYY
		let dueDateFormatted = formatDate(dueDateObject);

		const discountPercent = calculateDiscount(customerType, subtotal);
		const discountAmount = subtotal * discountPercent;
		const invoiceTotal = subtotal - discountAmount;

		$("#subtotal").val(subtotal.toFixed(2));
		$("#invoice_date").val(invoiceDateFormatted);
		$("#percent").val((discountPercent * 100).toFixed(2));
		$("#discount").val(discountAmount.toFixed(2));
		$("#total").val(invoiceTotal.toFixed(2));
		$("#due_date").val(dueDateFormatted);
		// set focus on type drop-down when done
		$("#type").focus();
	});

	$("#clear").click(() => {
		if (clearFirstTwo) {
			$("#type").val("reg");
			$("#subtotal").val("");
		}
		$("#invoice_date").val("");
		$("#percent").val("");
		$("#discount").val("");
		$("#total").val("");
		$("#due_date").val("");
		clearFirstTwo = true;
		// set focus on type drop-down when done
		$("#type").focus();
	});

	// set focus on type drop-down on initial load
	$("#type").focus();
});
