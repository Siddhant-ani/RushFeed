import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner"
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props)=> {
   
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults , setTotalResults] = useState(1);
    // document.title = `${capitaliseFirstLetter(props.category)} - RushFeed`

    const capitaliseFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }

    const updateNews = async ()=>{
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        console.log(parsedData);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100)
    }
    useEffect(()=>{
        document.title = `${capitaliseFirstLetter(props.category)} - RushFeed`
        updateNews();
         // eslint-disable-next-line 
    },[])

    // const handlePrevClick = async()=>{
    //     setPage(page - 1)
    //     updateNews();
    // } 
    
    
    // const handleNextClick = async()=>{
    // setPage(page + 1)
    // updateNews();
    // }

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1)
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        
    }

        return (
           <>
                <h1 className="text-center" style={{margin : "35px", marginTop : "90px"}}>RushFeed - Top {capitaliseFirstLetter(props.category)} Headlines </h1>
                {loading }

                <InfiniteScroll
                        dataLength={articles.length}
                        next={fetchMoreData}
                        hasMore={articles.length < totalResults}
                        loader={<Spinner/>}
                        >
                            <div className="container">
                        <div className="row">
                             {Array.from(new Set(articles.map((article) => article.url)))
                                .map((uniqueUrl, index) => {
                                const element = articles.find((article) => article.url === uniqueUrl);
                                return (
                                    <div className="col-md-4" key={element.url || index}>
                                        <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author = {element.author} date = {element.publishedAt} source ={element.source.name} />
                                    </div>
                                );
                            })}
                       </div>

                       </div>
                </InfiniteScroll>

      </>
        );
   
}




News.defaultProps = {
    country : 'us',
    pageSize : 8,
    category : 'general'
} 
News.propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
} 

export default News;
