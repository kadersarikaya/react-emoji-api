import {useState, useEffect} from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import copy from 'copy-to-clipboard';

function App() {
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [emojis, setEmojis] = useState(null)
  const [, setError] = useState(null);
  const [categories, setCategories] = useState(null)
  const emojisEndpoint = "https://emoji-api.com/emojis?access_key=efda08957690375e9795219f15f995113ac3aae8"
  const categoriesEndpoint = "https://emoji-api.com/categories?access_key=efda08957690375e9795219f15f995113ac3aae8"
  const categoryEndpoint = `https://emoji-api.com/categories/${category}?access_key=efda08957690375e9795219f15f995113ac3aae8`
  const [selectCat, setSelectedCat] = useState(false);
  const [copiedStates, setCopiedStates] = useState({});
  const [inputText, setInputText] = useState("");
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
    try {
      const [emojisResponse, categoriesResponse] = await Promise.all([
        fetch(emojisEndpoint),
        fetch(categoriesEndpoint)
      ]);

      const [emojisData, categoriesData] = await Promise.all([
        emojisResponse.json(),
        categoriesResponse.json()
      ]);

      setEmojis(emojisData);
      setCategories(categoriesData);
      setIsLoading(false);
    }
    catch(err) {
      setError(err);
      setIsLoading(false);
    }
   }
    fetchData();
  }, [])

  useEffect(() => {
    async function getEmojisInCat() {
      try {
        const res = await fetch(categoryEndpoint);
        const data = await res.json();
        setError(null);
        setCategory(data)
      }
      catch (err) {
        setCategory(null)
        setError(err);
      }
    }
    getEmojisInCat();

  }, [])

  useEffect(()=> {
    const filteredArr = emojis?.filter(
      (emoji) =>
        emoji?.slug.slice(5).replaceAll('-', ' ').includes(inputText.toLowerCase())
        && (!selectCat || emoji.group === category)
    );
    setFilteredEmojis(filteredArr);
  }, [emojis, inputText, category, selectCat])
  
  const handleCategory = (cat) => {
    setCategory(cat)
    setSelectedCat(true);
  } 

  

  const handleCopy = (character, index) => {
    copy(character);
    setCopiedStates(prevState => ({
      ...prevState,
      [index]:true
    }))

    setTimeout(()=> {
      setCopiedStates(prevState => ({
        ...prevState,
        [index]:false
      }))
    },2000)
  }

  return (
    <div className="container text-center">
      <div className="emojis d-flex mx-2">
        <div className="emoji">😍</div>
        <div className="emoji">😎</div>
        <div className="emoji">😀</div>
      </div>
      <div className="header mt-3">
        <h1 className="title">Welcome to Emoji <span className='hub-span'>Hub</span></h1>
        <p className='subtitle' >A free service for searching emoji</p>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1"> 🔍 </span>
          </div>
          <input onChange={(e)=>setInputText(e.target.value)}
          type="text" className="form-control" placeholder="Enter emoji name..." 
          aria-label="EmojiName" aria-describedby="basic-addon1"/>
        </div>
      </div>
      {categories?.map((cat, index) => (
        cat.subCategories[2] &&
          <div key={index} className="btn-group">
            { <button onClick={() => handleCategory(cat?.slug)} href="#" className="btn btn-info active" aria-current="page">
              {cat?.slug}
            </button>}
          </div>
      ))}
      {isLoading ? <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div> :(
      <div className="row">
        {filteredEmojis?.map((singleEmoji, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-12 mt-3">
            <div className="data">
              <div className="card">
                <button onClick={() => handleCopy(singleEmoji.character, index)} className='btn' >
                  {copiedStates[index] ? "Copied!": "Copy"}
                </button>
                <div className="card-body">
                  <h1>{singleEmoji.character}</h1>
                  <p className="card-text">
                    {singleEmoji?.slug.slice(5).replaceAll("-", " ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      ) }
      <div>
      </div>
    </div>
  )
}

export default App
