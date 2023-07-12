import React, { useState } from "react";
import axios from "axios";
import openai from "openai";
import "../styles/Form.css";
import loadingGif from "../images/loading-gif.gif";
const { Configuration, OpenAIApi } = require("openai");

function Form() {
  const [industry, setIndustry] = useState("");
  const [dataType, setDataType] = useState("");
  const [dataUsage, setDataUsage] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false); // Add this line

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `The goal is to create material that illustrates the value proposition of differential privacy in diverse scenarios. We aim to generate a use case to effectively communicate this to potential stakeholders. Here are the inputs provided:
    
      Industry or Sector: ${industry}
      (This helps us understand the privacy concerns and regulations unique to your industry and tailor the use case accordingly.)

      Types of Data Collected and Handled: ${dataType}
      (The nature of this data can greatly affect the implementation and benefits of differential privacy. For instance, healthcare data requires different approaches compared to e-commerce data.)

      Purpose of Data Usage: ${dataUsage}
      (This indicates how your organization intends to use the data. It could be for analytical purposes, machine learning, research, etc. It plays a vital role in determining the impact of differential privacy.)

      Based on these inputs, we aim to generate an output that includes the following. Make this a narrative have specific characters and a story line. Make everything very specific. Don't explain what differetnial privacy is. Do not be vague. Also do not make it about compliance. What are the risks specifically that an attacker could do if they found out the info.:

      a. Stakeholder and Goal: 
      Please specify the role of the stakeholder in the organization and the specific goal or task the stakeholder is trying to achieve using the data.
      
      b. Dataset:
      Please provide what a dataset would look like. Please give me the dataset labels and the data.  Do not return this information in a json format. Describe it in paragraph form.
      c. Risk of Releasing Data Without Proper Privacy:
      Please specify the specific type harm that could be done. Please illustrate this with an example individual from the data. Tell their story. What are the data they do not want leacked and  what specifically could happen if it was leaked. What informaiton does the attacker uncover and how do they harm that individaul.


      d. Benefits and Value Proposition: 
      Please specify how the stakeholder's specific goal could be achieved more effectively or efficiently by using differential privacy, rather than traditional privacy measures. Also, discuss how the implementation of differential privacy could benefit others in the organization, beyond the immediate stakeholder. In addition, describe the potential benefits for the organization's compliance with legal and regulatory requirements, and how the organization's reputation or public image could be enhanced by the implementation of differential privacy.
      
      please return this information in a json format. Do not add any headings. only use the following keys. No additional headings!!!.
      
      {
        "stakeholder": "stakeholder",
        "goal": "goal",
        "dataset": "dataset",
        "risk": "risk",
        "benefits": "benefits"
        
      }
      
      `,
        },
      ],
    });
    console.log(response.data.choices[0].message.content);
    setOutput(response.data.choices[0].message.content);
    setLoading(false); // Set loading to false when the request completes
  };

  function renderData(data, parentKey = "") {
    return Object.entries(data).map(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        return renderData(value, newKey);
      } else {
        return (
          <div key={newKey}>
            <h3>{newKey}</h3>
            <p>{value}</p>
          </div>
        );
      }
    });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>
          Industry or Sector:
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </label>
        <label>
          Types of Data Collected and Handled:
          <input
            type="text"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          />
        </label>
        <label>
          Purpose of Data Usage:
          <input
            type="text"
            value={dataUsage}
            onChange={(e) => setDataUsage(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {loading && <img src={loadingGif} alt="loading..." />}
      {output && (
        <div className="output">
          <h2>Output:</h2>
          {renderData(JSON.parse(output))}
        </div>
      )}
    </div>
  );
}

export default Form;
