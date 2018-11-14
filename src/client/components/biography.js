import React, { Component } from "react";
import './biography.css';

class Biography extends Component {

  render() {
    return <div className="biography_frame" dangerouslySetInnerHTML={{__html: this.props.text}}></div>;
  }
}

Biography.defaultProps = {
    text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo
    sapiente nobis labore libero obcaecati iusto provident maiores, totam
    inventore magni cum error recusandae odio adipisci laudantium vitae in
    vel distinctio, omnis eum <h1>itaque</h1> non ex dicta! Aliquam quae magnam suscipit,
    repudiandae, eum earum velit, quos, dolores quasi quidem impedit. Aliquid
    in odit corrupti rem repudiandae.`
}

export default Biography;
