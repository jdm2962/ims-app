import React from 'react';


class Table extends React.Component{

	constructor(props){
		super(props);

		fetch('http://ec2-54-90-134-15.compute-1.amazonaws.com/api/items')
		.then(console.log(res => res.json()))

		this.state = {

			// this is going to be an api call
			tableData : [
				{
					'category' : 'produce',
					'id' : 1,
					'name' : 'green beans'
				},
				{
					'category' : 'produce',
					'id' : 2,
					'name' : 'carrots'
				}
			]
		}

	}


	render(){
		
		const items = this.state.tableData.map((item) => {
			return (
				<tr className = 'tr'>
					<td className = 'td'>{item.category}</td>
					<td className = 'td'>{item.id}</td>
					<td className = 'td'>{item.name}</td>
				</tr>
			);
		});
		return(

			<table className = 'table'>
				<tr className = 'td'>
					<th className = 'th'>Category</th>
					<th className = 'th'>ID</th>
					<th className = 'th'>Name</th>
				</tr>
				{items}
			</table>
		);
	}
}

export default Table;