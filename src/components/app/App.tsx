import { useState } from "react";

import { BrowserRouter } from "react-router-dom";

import { api } from "@/core/api";
import { hook } from "@/core/hooks";
import { service } from "@/core/services";

import { Header } from "../interface";
import { MainPage } from "../pages";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

import "./App.css";

function App() {
	const arr = [
		api,
		Header,
		MainPage,
		Button,
		Calendar,
		useState,
		BrowserRouter,
		hook,
		service,
	];
	return (
		<>
			{/* <Calendar />
			<Calendar /> */}
		</>
	);
}

export default App;
