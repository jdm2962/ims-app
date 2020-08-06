import React from 'react';


class Table extends React.Component{

	constructor(props){
		super(props);

		this.state = {

			// this is going to be an api call
			tableData : []
		}
	}

	componentDidMount(){

		fetch('ec2-54-90-134-15.compute-1.amazonaws.com/api/items', {
			mode : 'cors',
			headers : {
				'Content-Type' : 'application/json',
			}
			
		})
		.then(res => res.json())
		.then(result => console.log(result))
		.catch((err) => {
			console.log(err);
		})
	}


	render(){
		
		const items = this.state.tableData.map((item) => {
			return (
				<tr className = 'tr'>
					<td className = 'td'>{items.category}</td>
					<td className = 'td'>{items.itemId}</td>
					<td className = 'td'>{items.name}</td>
				</tr>
			);
		});

		return(

			<table className = 'table'>
				<tbody className = 'tbody'>
					<tr className = 'td'>
						<th className = 'th'>Category</th>
						<th className = 'th'>ID</th>
						<th className = 'th'>Name</th>
					</tr>

				</tbody>
			</table>
		);
	}
}

export default Table;