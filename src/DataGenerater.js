import { useState } from "react";
import {
	Grid,
	Paper,
	Box,
	FormControl,
	InputLabel,
	Select,
	Input,
	Chip,
	MenuItem,
	Button,
} from "@material-ui/core";
import { options, dataTemplate } from "./data/options";
import { makeStyles } from "@material-ui/core/styles";
import faker from "faker";
import download from "downloadjs";

const categories = Object.keys(options);

const useStyles = makeStyles((theme) => ({
	heading: {
		justifyContent: 'center',
		display: 'flex',
		fontSize: 'xxx-large',
		color: 'wheat',
		padding: '25px'
	},
	formControl: {
		minWidth: "100%",
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
}));

const Form = (props) => {
	const classes = useStyles();
	const [data, setData] = useState(dataTemplate);
	const [numberOfData, setNumberOfData] = useState(1);

	const handleChange = (event) => {
		console.log(event.target.name, event.target.value);
		let copyData = { ...data };
		copyData[event.target.name] = {};
		event.target.value.forEach((item) => {
			copyData[event.target.name][item] = "";
		});
		setData(copyData);
	};

	const generateData = () => {
		let copyData = JSON.parse(JSON.stringify(options));
		let arrData = [];
		for (let i = 0; i < numberOfData; i++) {
			for (let category of categories) {
				for (let key of Object.keys(options[category])) {
					if (data[category][key] !== undefined) {
						copyData[category][key] = faker[category][key]();
					}
				}
			}
			arrData.push(copyData);
			copyData = JSON.parse(JSON.stringify(options));
		}

		download(JSON.stringify(arrData), "dummy_data.json", "json");
		setNumberOfData(1);
		setData(dataTemplate);
	};
	return (
		<>
			<div className={classes.heading}>{"Dummy Data Generater"}</div>
			<Grid container spacing={2}>
				{categories.map((category) => (
					<Grid item xs={12} sm={4} md={3} key={category}>
						<Paper component={Box} p={3}>
							<FormControl className={classes.formControl}>
								<InputLabel>{category}</InputLabel>
								<Select
									name={category}
									fullWidth
									multiple
									value={Object.keys(data[category])}
									onChange={handleChange}
									renderValue={(selected) => (
										<div className={classes.chips}>
											{selected.map((value) => (
												<Chip
													key={value}
													label={value}
													className={classes.chip}
												/>
											))}
										</div>
									)}
								>
									{Object.keys(options[category]).map((name) => (
										<MenuItem key={name} value={name}>
											{name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Paper>
					</Grid>
				))}
			</Grid>
			<Paper component={Box} my={1} p={3}>
				<InputLabel htmlFor="my-input">{'Number of dummy data'}</InputLabel>
				<Input
					id="my-input"
					fullWidth
					placeholder="Enter the number"
					value={numberOfData}
					type="number"
					onChange={(e) => setNumberOfData(e.target.value)}
					aria-describedby="my-helper-text"
				/>
			</Paper>
			<Button disabled={numberOfData == 0} variant="contained" color="secondary" onClick={generateData}>{'Generate'}</Button>
		</>
	);
};

export default Form;
