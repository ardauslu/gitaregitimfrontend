import React, { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import "./Etudes.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import config from "../config";

const etudesData = [
	{
		title: "Legato",
		videos: [
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
			"https://www.youtube.com/watch?v=ivFnSNZeWMY",
		],
	},
	{
		title: "Sweep Picking",
		videos: [
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
			"https://youtu.be/eDuiPDOf8TA",
		],
	},
	{
		title: "Economy Picking",
		videos: [
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
			"https://youtu.be/L2j7g85XYMo",
		],
	},
	{
		title: "Hybrid Picking",
		videos: [
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
			"https://youtu.be/fCC3Y0Q6dF4",
		],
	},
	{
		title: "Tapping",
		videos: [
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
			"https://youtu.be/mhSHiucbZQA",
		],
	},
];

const translations = {
	tr: {
		title: "Teknik Bahçesi",
		description: "Bu sayfa gitar teknikleri üzerine hazırlanmış etüdler içerir.",
	},
	en: {
		title: "The Technique Garden",
		description: "This page contains guitar etudes over different techniques.",
	},
};

const Etudes = () => {
	const [activeTab, setActiveTab] = useState(0);
	const { language, setLanguage } = useLanguage();
	const { isAuthenticated, logout: keycloakLogout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated, navigate]);

	const logout = useCallback(() => {
		keycloakLogout({ redirectUri: config.LOGOUT_REDIRECT_URI });
	}, [keycloakLogout]);

	return (
		<div>
			<Header language={language} setLanguage={setLanguage} logout={logout} />
			<Subheader language={language} />
			<div className="etudes-content">
				<header className="etudes-header">
					<h1>{translations[language].title}</h1>
					<p>{translations[language].description}</p>
				</header>
				<div className="etudes-tabs">
					{etudesData.map((etude, idx) => (
						<button
							key={etude.title}
							className={activeTab === idx ? "active" : ""}
							onClick={() => setActiveTab(idx)}
						>
							{etude.title}
						</button>
					))}
				</div>
				<div className="etudes-videos">
					{etudesData[activeTab].videos.map((url, idx) => (
						<div key={idx} className="etude-video-item">
							<ReactPlayer
								url={url}
								controls={true}
								width="100%"
								height="150px"
								className="video-player"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Etudes;