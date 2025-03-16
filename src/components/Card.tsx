import React from "react";
import "./Card.css";

const Card = () => {
  return (
    <div className="card-container">
      <div className="card-image" title="Woman holding a mug">
        <img src="https://picsum.photos/400/200" />
      </div>
      <div className="card-content">
        <div className="card-description">
          <p className="card-tag">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
            </svg>
            Members only
          </p>
          <div className="card-title">Can coffee make you a better developer?</div>
          <p className="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem
            praesentium nihil.
          </p>
        </div>
        <div className="card-author">
          <div className="author-info">
            <p className="author-name">Jonathan Reinink</p>
            <p className="author-date">Aug 18</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
