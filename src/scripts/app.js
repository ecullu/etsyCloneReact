// const React = require('react'),
// 	ReactDOM = require('react-dom')

import Backbone from 'backbone'
import React from 'react'
import ReactDOM from 'react-dom'

const app = function() {

	var HomeView = React.createClass({

		render: function (){
					console.log('Homeview >>>',this)
			return (
					<div id="homeView">
						<NavBar />
						<ListWrapper collection = {this.props.collection}/>
				   </div>
				)
		}
	})

	var NavBar = React.createClass({

		_handleSearch: function(e){
			if(e.keyCode === 13){
				location.hash = `search/${e.target.value}`
				e.target.value = ''
			}
		},

		render: function(){
		return (
				<div id="nav-bar">
	 				<div id="menu">
						<a href="#home"><span>Home</span></a>
						<span>Clothing & Accesories</span>
						<span>Jewelry</span>
						<span>Crafts Supplies & Tools</span>
						<span>Weddings</span>
						<span>Entertainment</span>
						<span>Home&Living</span>
						<span>Kids & Baby</span>
						<span>Vintage</span>
					 	<input onKeyDown={this._handleSearch} id="search" placeholder="Search for items"></input>
				 	</div>
				 </div>
				)
			}
		})

	const ListWrapper = React.createClass({

		_getJsxArray: function(listingArr){
			// console.log('here comes listingArr', listingArr)
			var jsxArr = []
			listingArr.forEach(function(listing){
				console.log(listing)
				jsxArr.push(<Listing listingModel={listing} />)
			})
			return jsxArr
		},

		render: function(){
			// console.log('here comes this in ListWrapper render', this)
			return (
				<div id="list-wrapper">
					{this._getJsxArray(this.props.collection.models)}
				</div>
			)
		}
	})

	var Listing = React.createClass({
		render: function(){
			// console.log('this in listing component>>> ',this.props.listingModel)
		var item = this.props.listingModel.attributes
		return (
				<div className="listing">
					<a href={'#details/'+ item.listing_id}>
					<img src={item.Images[0].url_170x135}/>
			 		<div className="title">{item.title}</div>
					<div className="info">
						<div className="shop-name">{item.Shop.shop_name}</div>
			 			<div className="price">{item.price}</div>
					</div>
					</a>
				</div>
			)
		}
	})

	var DetailView = React.createClass({
		render: function(){
			console.log('detail view>>', this.props.listing)
			return (
					<div id="details">
						<NavBar />
						<ItemDetails item = {this.props.listing}/>
					</div>
				)
		}
	})

	var ItemDetails = React.createClass({
		render: function(){
			console.log('here comes single listing >> ', this.props.item.attributes['0'])
			var itemData = this.props.item.attributes['0'] 
			return (
					<div id="detail-view">
					 	<div id="previous" className="arrow">{String.fromCharCode(60)}</div>
					 	<div id="product-detail">
							<div id="product-image">
								<img src={itemData.Images[0].url_570xN}/>
							</div>
							<div id="product-desc">{itemData.description}</div>
					 	</div>
					 	<div id="next" className="arrow">{String.fromCharCode(62)}</div>
					 </div>
				)
		}
	})

	var SearchView = React.createClass({
		render: function (){
			return (
					<div id="homeView">
						<NavBar />
						<ListWrapper collection = {this.props.collection}/>
				   </div>
				)
		}
	})

//Backbone Model
var ListCollection = Backbone.Collection.extend({
	url: 'https://openapi.etsy.com/v2/listings/active.js',
	_apikey: 'vjvzvfjyg9jd3mim1gomdhq5',
	parse: function(rawJSONP){
		console.log(rawJSONP)
		return rawJSONP.results
		}
})

var DetailModel = Backbone.Model.extend({
	url: 'https://openapi.etsy.com/v2/listings/',
	_apikey: 'vjvzvfjyg9jd3mim1gomdhq5',
	parse: function(rawJSONP){
		console.log(rawJSONP)
		return rawJSONP.results
	}
})

//Backbone Router
var EtsyRouter = Backbone.Router.extend({
	routes:{
		'home': 'showHomePage',
		'search/:query': 'showSearchResults',
		'details/:id': 'showDetails',
		'*catchall': 'redirectToHome'
	},

	showHomePage: function(){
		var activeCollections = new ListCollection()
		activeCollections.fetch({
			dataType: 'jsonp',
			data: {
				api_key: activeCollections._apikey,
				includes: 'Images,Shop'
			}
		}).then(function(){
			ReactDOM.render(<HomeView collection = {activeCollections}/>,document.querySelector('.container'))
		})

	},

	showSearchResults: function(keyword){
		//create a new collection
		var searchedCollection = new ListCollection()
		//fetch search result
		searchedCollection.fetch({
			dataType: 'jsonp',
			data:{
				api_key: searchedCollection._apikey,
				includes: 'Images,Shop',
				keywords: keyword
			}
		}).then(function (){
			ReactDOM.render (<SearchView collection = {searchedCollection} />, document.querySelector('.container')) 
		})
	},

	showDetails: function(listID){
	//create new detail model
	var listingDetailModel = new DetailModel()
	//update fetch url
	listingDetailModel.url += listID + '.js'
	//fetch the listing model via API
	listingDetailModel.fetch({
		dataType: 'jsonp',
		data:{
			api_key: listingDetailModel._apikey,
			includes: 'Images,Shop'
			}
		}).then(function(){
			ReactDOM.render(<DetailView listing={listingDetailModel} />, document.querySelector('.container'))
		})
	},

	redirectToHome: function(){
		location.hash = "home"
	},

	initialize: function(){
		Backbone.history.start()
	}
})

new EtsyRouter()
}


app()