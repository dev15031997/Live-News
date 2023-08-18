import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

export class News extends Component {
 
  static defaultProps={
    country:'in',
    pageSize:8,
    category:'general'
  }

  static propTypes={
    country:PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string
  }

   capFirst=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  constructor(props){
    super(props);
    this.state={
      articles:[],
      loading:true,
      page:1,
      totalResults:0
    }

    document.title=`${this.capFirst(this.props.category)}-Daily News`
  }

  async updateNews(pageNo){
    this.props.setProgress(10);
    let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data=await fetch(url)
    this.props.setProgress(40);
    let parsedData=await data.json()
    this.props.setProgress(70);
    this.setState({articles:parsedData.articles,totalResults:parsedData.totalResults,loading:false});
    this.props.setProgress(100);

  }

  async componentDidMount(){
    this.updateNews()
  }
  
  fetchMoreData=async ()=>{
    this.setState({page:this.state.page+1});
    let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data=await fetch(url)
    let parsedData=await data.json()
    this.setState({articles:this.state.articles.concat(parsedData.articles),
      totalResults:parsedData.totalResults})
  }
   
  render() {
    return (
      <>
      <h1 className="text-center" style={{margin:"35px 0",marginTop:'90px'}}>Daily News-Top {this.capFirst(this.props.category)} Headlines</h1>
      {this.state.loading && <Spinner/>}
      <InfiniteScroll dataLength={this.state.articles.length} next={this.fetchMoreData} hasMore={this.state.articles.length!==this.state.totalResults} loader={<Spinner/>} >
      <div className="container">
      <div className="row">
      {this.state.articles.map((elm)=>{
        return  <div className="col-md-4" key={elm.url}>
         <NewsItem  title={elm.title?elm.title:""} description={elm.description?elm.description:""} newsUrl={elm.url}  imgUrl={elm.urlToImage?elm.urlToImage:"https://www.hindustantimes.com/ht-img/img/2023/07/30/1600x900/_78b5c914-9513-11ea-9070-932bbf5d90a5_1690695300941.jpg"}  author={elm.author?elm.author:"Unknown"} date={elm.publishedAt} source={elm.source.name}/>
        </div>
      })}
      </div>
      </div>
      </InfiniteScroll>
      </>
    )
  }
} 

export default News





