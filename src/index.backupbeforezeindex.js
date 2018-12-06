import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as serviceWorker from './serviceWorker';
import createHistory from "history/createBrowserHistory"
import queryString from 'query-string'
import { Alert, Button, ButtonGroup, DropdownMenu, DropdownItem, NavbarBrand, Navbar, NavbarToggler, Nav, UncontrolledDropdown, Collapse, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faFolderOpen, faCode, faEdit, faPlus, faHeart, faShare, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'

library.add([faChartLine, faFolderOpen, faCode, faEdit, faPlus, faHeart, faShare, faCheck, faTimes
])

const history = createHistory();

class DashboardFrame extends Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad(){
    const frame = document.getElementById('looker3')
    const looker3 = frame.contentDocument || frame.contentWindow.document;
    looker3.getElementById('lk-title').style.setProperty('--theme-tile_background_color','#343a40');
    if (looker3.querySelector('#lk-title > div.lk-title-controls-container > div.lk-title-controls.ng-scope > div.dashboard-dropdown.ng-scope.dropdown')) {
      looker3.querySelector('#lk-title > div.lk-title-controls-container > div.lk-title-controls.ng-scope > div.dashboard-dropdown.ng-scope.dropdown').parentNode.removeChild(looker3.querySelector('#lk-title > div.lk-title-controls-container > div.lk-title-controls.ng-scope > div.dashboard-dropdown.ng-scope.dropdown'))
    }    
    this.props.toggleHidden('isHidden3',true)
  }

  render() {
    const z = (this.props.rSelected === 'dash') ? 1 : -1
    // const dashboard_id = "1";
    const src = (this.props.did) ? '/embed/dashboards/' + this.props.did : '';
    return (
      <iframe
      id = "looker3"
      width = "100%"
      height = "100%"
      src={src}
      style={{border: 0, position: "absolute", zIndex: z}}
      onLoad={this.handleLoad}
      ></iframe>
    )
  }
}

class SqlFrame extends Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this);
    this.updateSqlVis = this.updateSqlVis.bind(this);
    this.watchHref = this.watchHref.bind(this);
    this.updateSqlUrl = this.updateSqlUrl.bind(this);

    this.state = {
      exploreFrameSrc: '',
      vis: {},
      sql_url: '/sql/' + this.props.sql_slug
    }

  }

  updateSqlUrl(sql_slug) {
    this.setState({
      sql_url: (this.props.sql_slug) ? '/sql/' + this.props.sql_slug : '/sql'
    })
  }

  componentDidMount() {
    if (this.props.qid) {
      apiCall('GET','/api/internal/core/3.1/queries/slug/'+this.props.qid)
      .then(response => {
        this.setState({
          exploreFrameSrc: '/embed' + response.url + '&toggle=' + this.props.toggle,
          vis: response.vis_config
        });
      })
    }  else {
      this.setState({
        exploreFrameSrc: '',
        vis: {}
      });
    }
    // this.watchHref();
  }

  updateSqlVis(obj) {
    this.setState({
      vis: obj
    })
  }

  getQueryMetaData(href, vis) {
    let url = '/api/internal/dataflux/explores/' + href.split('/explore/')[1].split('/')[0] + '::sql_runner_query'
  
    apiCall('GET',url)
    .then(response => {
      var fields = response.fields.dimensions;
  
      var dynamic_fields = [];
      var selected = [];
      var sorts = [];
      var dates_removed = [];

      var sql_property_counts = {};
      for (var i = 0; i < fields.length; i++) {
        if (sql_property_counts[fields[i].sql]) {
          sql_property_counts[fields[i].sql] = sql_property_counts[fields[i].sql] + 1;
        } else {
          sql_property_counts[fields[i].sql] = 1
        }
      }
  
      for (var i = 0; i < fields.length; i++) {
        if (sql_property_counts[fields[i].sql] > 1 && fields[i].type.substring(0,4) == 'date' && fields[i].type != 'date_time') {
          dates_removed.push(fields[i].name);
        } else if (fields[i].is_numeric) {
          var temp = {
            "measure": "",
            "based_on": "",
            "expression": "",
            "label": "",
            "type": "sum",
            "_kind_hint": "measure",
            "_type_hint": "number"
          } 
          temp.measure = "field"+i;
          temp.based_on = fields[i].name;
          temp.label = fields[i].label;
          dynamic_fields.push(temp);
          selected.push(temp.measure);
        } else {
          selected.push(fields[i].name);
          if (selected.length == 1) {
            sorts.push(fields[i].name);
          }
        }
      }
      return {  "selected": selected, 
                "dynamic_fields": dynamic_fields, 
                "sorts": sorts, 
                "model": response.model_name,
                "vis_config": vis
              };
    })
    .then(response => {
      apiCall('POST','/api/internal/core/3.1/queries', '', createQuery(response))
      .then(response => {
        this.setState({
          exploreFrameSrc: '/embed'+response.url+'&toggle=' + this.props.toggle
        })
      })
    })
  }

  watchHref(slugNode) {
    if (this.state.mutation) {
      this.state.mutation.disconnect();
    }

    // const frame = document.getElementById('looker')
    // const innerDoc = frame.contentDocument || frame.contentWindow.document;
    // let slugNode = innerDoc.querySelector("#lk-title > div.lk-title-controls.ng-scope > ul > li:nth-child(5) > a")

    let mutation = new MutationObserver(mutations => {
      mutations.some(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href' && mutation.target.href) {
          if (mutation.target.href) {
            if(mutation.target.href.split('/explore/sql__')[1].split('/')[0] != this.props.sql_slug) {
              this.props.toggleHidden('isHidden2',false);
              this.props.updateAppParams({
                sql_slug: mutation.target.href.split('/explore/sql__')[1].split('/')[0]
              })
              this.getQueryMetaData(mutation.target.href,this.state.vis);
            }
          }
          return true;
        }
        return false;
      });
    })

    mutation.observe(slugNode, {
      attributes: true,
      attributeFilter: ['href'],
      attributeOldValue: true,
      characterData: false,
      characterDataOldValue: false,
      childList: false,
      subtree: true
    });

    this.setState({
      mutation: mutation
    })
  }

  handleLoad() {
    const frame = document.getElementById('looker')
    const innerDoc = frame.contentDocument || frame.contentWindow.document;
    innerDoc.getElementById('lk-container').style.top = "0px";
    if (innerDoc.getElementById('lk-nav-main')) {
      innerDoc.getElementById('lk-nav-main').parentNode.removeChild(innerDoc.getElementById('lk-nav-main'));
    }
    
    var checkExist = setInterval(() => {
      if (innerDoc.querySelectorAll("#lk-title > div.lk-title-controls.ng-scope > ul > li").length) {
         clearInterval(checkExist);
         let possibleNodes = innerDoc.querySelectorAll("#lk-title > div.lk-title-controls.ng-scope > ul > li");
    
         var slugNode = <></>
         for (var i=0; i<possibleNodes.length; i++) {
           if (possibleNodes[i].childNodes[0] != null && possibleNodes[i].childNodes[0].innerHTML == 'Explore') {
             slugNode = possibleNodes[i].childNodes[0]
             this.watchHref(slugNode)
           }
         }
      }
    }, 100); 
    
    if ( innerDoc.getElementById('dev-mode-bar')) {
      innerDoc.getElementById('dev-mode-bar').parentNode.removeChild(innerDoc.getElementById('dev-mode-bar'));
    }
    if (innerDoc.querySelector("#lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle")) {
      innerDoc.querySelector("#lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle").parentNode.removeChild(innerDoc.querySelector("#lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle"))
    }

    var checkExist2 = setInterval(() => {
      if (innerDoc.getElementById('lk-container') && innerDoc.getElementById('lk-title')) {
        clearInterval(checkExist2);
        innerDoc.getElementById('lk-container').style.top = "0px";
        innerDoc.getElementById('lk-title').style.background = "#343a40";
      }
    }, 100); 
    
    // innerDoc.getElementById('lk-container').style.top = "0px";
    // innerDoc.getElementById('lk-title').style.background = "#343a40";
    // #lk-embed-container > lk-explore-dataflux > lk-explore-header > div.title-controls > button.btn.btn-default

    this.props.toggleHidden('isHidden1',true)
  }

  render() {
    const z = (this.props.rSelected === 'sql') ? 1 : -1;
    return (
      <>
      <iframe 
        id="looker"
        height="100%" 
        width="100%"
        src={this.state.sql_url}
        style={{position: "absolute", border: 0, zIndex: z}}
        onLoad={this.handleLoad}
      ></iframe>
      <ExploreFrame 
        exploreSrc={this.state.exploreFrameSrc}
        updateAppParams={this.props.updateAppParams}
        updateSqlVis={this.updateSqlVis}
        rSelected={this.props.rSelected}
        toggleHidden={this.props.toggleHidden}
      >
      </ExploreFrame>
      </>
    )
  }
}

class ExploreFrame extends Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      queryParam: '?'
    }
  }

  handleLoad() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    
    const frame = document.getElementById('looker2')
    const looker2 = frame.contentDocument || frame.contentWindow.document;
    // change header to match the black
    if (looker2.getElementsByTagName('lk-explore-header').length > 0) {
      looker2.getElementsByTagName('lk-explore-header')[0].style.background = "#343a40";
    }
    // remove the space nav
    if (looker2.getElementsByTagName("lk-space-nav").length > 0 && looker2.getElementsByTagName("lk-space-nav")[0].parentNode) {
      looker2.getElementsByTagName("lk-space-nav")[0].parentNode.removeChild(looker2.getElementsByTagName("lk-space-nav")[0]);
    }
    // looker2.getElementsByTagName("lk-space-nav")[0].parentNode.removeChild(looker2.getElementsByTagName("lk-space-nav")[0]);
    // remove the gear icon
    if (looker2.querySelector("#lk-embed-container > lk-explore-dataflux > lk-explore-header > div.title-controls > div.explore-header-menu.ng-scope.dropdown")) {
      looker2.querySelector("#lk-embed-container > lk-explore-dataflux > lk-explore-header > div.title-controls > div.explore-header-menu.ng-scope.dropdown").parentNode.removeChild(looker2.querySelector("#lk-embed-container > lk-explore-dataflux > lk-explore-header > div.title-controls > div.explore-header-menu.ng-scope.dropdown"));
    }

    var editCSS = looker2.createElement('style')
    editCSS.innerHTML = `
      .btn-default, .btn-default:focus {
        color: #fff;
        background: #64518a;
        border: 1px solid #64518a;
        margin-left: 12px;
      }`;
      `.btn-default:focus:hover, .btn-default:hover {
        color: #fff;
        background: #64518a;
        border: 1px solid #64518a;
        margin-left: 12px;
    }`
    document.body.appendChild(editCSS);
    // looker2.querySelector("#lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle").classList.add('btn-primary')
    // looker2.querySelector("#lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle").classList.remove('btn-default')
    // #lk-embed-container > lk-explore-dataflux > lk-explore-header > div.title-controls > div.explore-header-menu.ng-scope.dropdown
    var interval = setInterval(()=> {
      if ( !looker2.location ) {
        clearInterval(interval);
      } else if ( this.state.queryParam !== looker2.location.search ) {
        let queryParamObj = queryString.parse(looker2.location.search);

        this.props.updateAppParams({
          toggle: queryParamObj.toggle
        })

        apiCall('GET','/api/internal/core/3.1/queries/slug/'+queryParamObj.qid)
        .then(response => {
          this.setState({
            queryParam: looker2.location.search
          })
          this.props.updateAppParams({
            qid: queryParamObj.qid
          })
          this.props.updateSqlVis(response.vis_config)
        })
      }
    }, 1000);

    this.setState({
      interval: interval
    })

    this.props.toggleHidden('isHidden2',true)

  }

  render() {
    const z = (this.props.rSelected === 'vis') ? 1 : -1
    return (
      <iframe 
        id="looker2"
        height="100%" 
        width="100%"
        src={this.props.exploreSrc}
        style={{position: "absolute", border: 0, zIndex: z}}
        onLoad={this.handleLoad}
      ></iframe>
    )

  }
}

class Frames extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
    <>
    <div 
      id="wrapper"
      style={{position:"absolute", zIndex:"0", width:"100%", height:"100%"}}
    >
    <SqlFrame
      updateAppParams={this.props.updateAppParams}
      sql_slug={this.props.sql_slug}
      qid={this.props.qid}
      toggle={this.props.toggle}
      rSelected={this.props.rSelected}
      style={{top:"-100px"}}
      toggleHidden={this.props.toggleHidden}
    ></SqlFrame>
    <DashboardFrame
    rSelected={this.props.rSelected}
    did={this.props.did}
    toggleHidden={this.props.toggleHidden}
    ></DashboardFrame>
    <div style={{height:"100%", width:"100%", color:"#fff", top:"0", display: "block", background: "#fff", position:"absolute", zIndex:"0"}}></div>
    </div>
    </> 
    )

  }
}

class ButtonController extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    let visDisabled = (this.props.qid && this.props.qid != '') ? false : true;
    let dashDisabled = (this.props.did && this.props.did != '') ? false : true;
    return (
      <>
        <ButtonGroup>
          <Button color="light" onClick={() => this.props.onRadioBtnClick('sql')} active={this.props.rSelected === 'sql'}><FontAwesomeIcon icon="code"/></Button>
          <Button outline={visDisabled} color="light" onClick={() => this.props.onRadioBtnClick('vis')} disabled={visDisabled} active={this.props.rSelected === 'vis'}><FontAwesomeIcon icon="edit"/></Button>
          <Button outline={dashDisabled} color="light" onClick={() => this.props.onRadioBtnClick('dash')} disabled={dashDisabled} active={this.props.rSelected === 'dash'}><FontAwesomeIcon icon="chart-line"/></Button>
        </ButtonGroup>
    </>
    )
  }
}

class DashButtons extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSqlTilesClick = this.handleSqlTilesClick.bind(this);
    this.jumpToSql = this.jumpToSql.bind(this);
    this.state = {
      modal: false
    };
  }

  jumpToSql(event) {
    this.props.toggleHidden('isHidden1',false)
    this.props.toggleHidden('isHidden2',false)
    this.props.updateAppParams({
      qid: event.target.getAttribute('qid'),
      did: event.target.getAttribute('did'),
      sql_slug: event.target.getAttribute('sql_slug'),
    })
    this.props.startEdit(event)
    document.getElementById('looker').setAttribute('src','/sql/' + event.target.getAttribute('sql_slug'));
    const exploreUrl = '/embed/explore/sql__' + event.target.getAttribute('sql_slug') + '/sql_runner_query?qid=' + event.target.getAttribute('qid') + '&toggle=' + this.props.toggle
    document.getElementById('looker2').setAttribute('src',exploreUrl);
    this.props.rSelectedJump('sql');
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      contentPage: 0
    });
  }

  shareClick() {
    const frame = document.getElementById('looker3')
    const looker3 = frame.contentDocument || frame.contentWindow.document;
    window.open(looker3.location.href.replace('/embed/','/'), '_blank');
  }

  handleSqlTilesClick() {
    this.setState({
      modal: !this.state.modal
    });
    apiCall('GET','/api/internal/core/3.1/dashboards/'+this.props.did)
    .then(response => {
      this.props.updateDashboardElements(response.dashboard_elements)
    })
  }

  render() {

    let dashDisabled = true;
    if ( this.props.did ) {
      dashDisabled = false;
      let sql_elements = this.props.d_elements.map(d_element => {
        if (d_element.query && d_element.query.model.substring(0,5) == 'sql__') {
          return {
            title: d_element.title,
            type: 'dashboard_element',
            d_element_id: d_element.id,
            qid: d_element.query.client_id,
            did: d_element.dashboard_id,
            sql_slug: d_element.query.model.split('sql__')[1]
          }
        } 
      }).filter(function (el) {return el != null;})
      if (sql_elements.length == 0) {
        var element_alerts =  ( <><Alert color="warning">No SQL Runner Elements on this Dashboard</Alert></> )
      } else {
        var element_alerts = sql_elements.map(sql_element => {
          return (
            <Alert 
              key={sql_element.d_element_id + ',' + sql_element.sql_slug}
              sql_slug={sql_element.sql_slug}
              qid={sql_element.qid}
              d_element_id={sql_element.d_element_id}
              value={sql_element.title}
              data-type={sql_element.dashboard_element}
              color="dark"
              did={sql_element.did}
              onClick={this.jumpToSql}
              style={{cursor: "pointer"}}
            >{sql_element.title}</Alert>
            )
        })
      } 
    }

    return (
    <>
    <Button outline={dashDisabled} className="float-left" disabled={dashDisabled} color="secondary" onClick={this.shareClick}><FontAwesomeIcon icon="share"/></Button>
    <Spacer></Spacer>
    <Button color="secondary" onClick={this.handleSqlTilesClick}>SQL Tiles</Button>
    <Modal isOpen={this.state.modal} toggle={this.toggle}>
         <ModalHeader toggle={this.toggle}>List of SQL Tiles on Dashboard</ModalHeader>
         <ModalBody >
           Click to edit SQL of a tile:<br></br><br></br>
           {element_alerts}
         </ModalBody>
         <ModalFooter >
          {/* <Button color="info" onClick={this.toggle}>Jump to SQL</Button> */}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
         </ModalFooter>
       </Modal>
       </>
    )
  }
}

class SqlButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      title: ''
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.toggle = this.toggle.bind(this);
    this.shareClick = this.shareClick.bind(this);
  }

  handleChangeName(event) {
    this.setState({
      title: event.target.value
    })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  shareClick() {
    const frame = document.getElementById('looker')
    const looker = frame.contentDocument || frame.contentWindow.document;
    window.open(looker.location.href.replace('/embed/','/'), '_blank');
  }

  render() {
    let sqlDisabled = true;
    let alertWarning = ''
    if ( this.props.sql_slug ) {
      sqlDisabled = false;
    }
    return (
      <>
      <Button outline={sqlDisabled} className="float-left" disabled={sqlDisabled} color="secondary" onClick={this.toggle}><FontAwesomeIcon icon="plus"/></Button>
      <Button outline={sqlDisabled} className="float-left" disabled={sqlDisabled} color="secondary" onClick={this.shareClick}><FontAwesomeIcon icon="share"/></Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Add Element to Dashboard?</ModalHeader>
        <ModalBody>
          {!(this.props.did && this.props.qid) && <Alert color="warning">Please select a dashboard</Alert>}
          {this.props.did && this.props.qid && 
          <InputGroup>
            <InputGroupAddon addonType="prepend">title</InputGroupAddon>
            <Input value={this.state.title} onChange={this.handleChangeName} placeholder="enter title" />
          </InputGroup>}
        </ModalBody>
        <ModalFooter>
        {this.props.did && this.props.qid && <AddToDashboard 
            toggle={this.toggle}
            sql_slug={this.props.sql_slug}
            qid={this.props.qid}
            did={this.props.did}
            title={this.state.title}
            updateDashboardElements={this.props.updateDashboardElements}
            toggleHidden={this.props.toggleHidden}
          ></AddToDashboard>}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      </>
    )
  }
}

class VisButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      title: ''
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleChangeName(event) {
    this.setState({
      title: event.target.value
    })
  }

  shareClick() {
    const frame = document.getElementById('looker2')
    const looker2 = frame.contentDocument || frame.contentWindow.document;
    window.open(looker2.location.href.replace('/embed/','/'), '_blank');
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    let visDisabled = true
    if ( this.props.qid ) {
      visDisabled = false;
    }
    return (
      <>
      <Button outline={visDisabled} color="secondary" className="float-left" disabled={visDisabled} onClick={this.toggle}><FontAwesomeIcon icon="plus"/></Button>
      <Button outline={visDisabled} color="secondary" className="float-left" disabled={visDisabled} onClick={this.shareClick}><FontAwesomeIcon icon="share"/></Button>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Add Element to Dashboard?</ModalHeader>
        <ModalBody>
          {!(this.props.qid && this.props.did) && <Alert color="warning">Please select a dashboard</Alert>}
          {this.props.qid && this.props.did && <InputGroup>
            <InputGroupAddon addonType="prepend">title</InputGroupAddon>
            <Input value={this.state.title} onChange={this.handleChangeName} placeholder="enter title" />
          </InputGroup>
          }
        </ModalBody>
        <ModalFooter>
        {this.props.did && this.props.qid && <AddToDashboard 
            toggle={this.toggle}
            sql_slug={this.props.sql_slug}
            qid={this.props.qid}
            did={this.props.did}
            title={this.state.title}
            updateDashboardElements={this.props.updateDashboardElements}
            toggleHidden={this.props.toggleHidden}
          ></AddToDashboard>}
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      </>
    )
  }
}

class ModalExample extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.rSelected == 'vis') {
      return (
        <VisButtons
          sql_slug={this.props.sql_slug}
          qid={this.props.qid}
          did={this.props.did}
          updateDashboardElements={this.props.updateDashboardElements}
          toggleHidden={this.props.toggleHidden}
        ></VisButtons>
      );
    } else if (this.props.rSelected == 'dash') {
      return (
        <DashButtons
          did={this.props.did}
          toggle={this.props.toggle}
          d_elements={this.props.d_elements}
          rSelectedJump={this.props.rSelectedJump}
          updateAppParams={this.props.updateAppParams}
          toggleHidden={this.props.toggleHidden}
          updateDashboardElements={this.props.updateDashboardElements}
          startEdit={this.props.startEdit}
        ></DashButtons>
      )
    } else if (this.props.rSelected == 'sql') {
      return (
        <SqlButtons
          sql_slug={this.props.sql_slug}
          qid={this.props.qid}
          did={this.props.did}
          updateDashboardElements={this.props.updateDashboardElements}
          toggleHidden={this.props.toggleHidden}
        ></SqlButtons>
      )
    } else {
      return (<div></div>)
    }
  }
}

class AddToDashboard extends Component {
  constructor(props){
    super(props)
    this.addElementToDashboard = this.addElementToDashboard.bind(this);
  }
  
  addElementToDashboard() {
    this.props.toggle();
    apiCall('GET','/api/internal/core/3.1/queries/slug/'+this.props.qid)
    .then(response => {
      var body = {
        "dashboard_id": this.props.did,
        "query_id": response.id,
        "type": "vis",
        "title": (this.props.title) ? this.props.title : 'New SQL Element'
      }
      apiCall('POST','/api/internal/core/3.1/dashboard_elements','',body)
      .then(response => {
        this.props.toggleHidden('isHidden3',false)
        document.getElementById('looker3').contentWindow.location.reload()
        apiCall('GET','/api/internal/core/3.1/dashboards/'+this.props.did)
        .then(response => {
          this.props.updateDashboardElements(response.dashboard_elements)
        })
      })
    })
  }
  
  render() {
    return (<Button onClick={this.addElementToDashboard} color="info">Add to Dashboard</Button>)
  }
}

class Navigator extends Component {
  constructor(props) {
    super(props);
    
    this.toggle = this.toggle.bind(this);
    this.rSelectedJump = this.rSelectedJump.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);

    this.state = {
      dropdownOpen: false,
      rSelected: (this.props.qid) ? 'vis' : 'sql',
      editTile: false,
      editingElementId: null
    };
  }

  startEdit(event,sql_slug,qid) {

    this.setState({
      editTile: true,
      editingElementId: event.target.getAttribute('d_element_id').toString()
    })
  }

  cancelEdit() {
    this.setState({
      editTile: false,
      editingElementId: null
    })
  }

  submitEdit() {
    let d_element_id = this.state.editingElementId
    var query_id_promise = apiCall('GET','/api/internal/core/3.1/queries/slug/'+this.props.qid)
    .then(response => {
      apiCall('PATCH','/api/internal/core/3.1/dashboard_elements/' + d_element_id,'',{query_id: response.id})
      .then(()=>{
        document.getElementById('looker3').contentWindow.location.reload()
        this.rSelectedJump('dash')
        this.setState({
          editTile: false,
          editingElementId: null
        })
      })
    })
    // var sql_slug_promise = new Promise(function(resolve,reject) {
    // Promise.all
 

    // }

    // apiCall('PATCH','/dashboard_elements/' + this.state.editingElementId,'',body)
    //   .then(() => {
    //     document.getElementById('looker3').contentWindow.location.reload()
    //   })

    

  }

  rSelectedJump(goto) {
    this.setState({ rSelected: goto })
  }

  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }

  toggle() {
    this.props.resetObjects();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <>
      <Frames 
      sql_slug={this.props.sql_slug}
      qid={this.props.qid}
      did={this.props.did}
      toggle={this.props.toggle}
      updateAppParams={this.props.updateAppParams}
      rSelected={this.state.rSelected}
      toggleHidden={this.props.toggleHidden}
    ></Frames> 
      <Navbar 
      style={{height:"49px"}}
      color="dark" className="navbar navbar-dark bg-dark w-75" fixed="top" expand="md">
        <NavbarBrand className="text-white"><b>SQL Runner 2.1</b>   <small><i>for nubank</i></small></NavbarBrand>
                {/* Add toggler to auto-collapse */}
        <NavbarToggler/>
        <div className="divider-vertical"></div>
        <ButtonController 
    updateAppParams={this.updateAppParams}
    sql_slug={this.props.sql_slug}
      qid={this.props.qid}
      did={this.props.did}
      toggle={this.props.toggle}
      onRadioBtnClick={this.onRadioBtnClick}
      rSelected={this.state.rSelected}
    ></ButtonController>
    <Spacer></Spacer>
    { !this.state.editTile && <ModalExample
      sql_slug={this.props.sql_slug}
      qid={this.props.qid}
      did={this.props.did}
      toggle={this.props.toggle}
      rSelected={this.state.rSelected}
      d_elements={this.props.d_elements}
      updateAppParams={this.props.updateAppParams}
      rSelectedJump={this.rSelectedJump}
      updateDashboardElements={this.props.updateDashboardElements}
      toggleHidden={this.props.toggleHidden}
      startEdit={this.startEdit}
    ></ModalExample> }
    { this.state.editTile && 
      <EditTile 
        cancelEdit={this.cancelEdit}
        submitEdit={this.submitEdit}
      ></EditTile>
    }
    <Spacer></Spacer>
    <Collapse isOpen={this.state.isOpen} navbar>
      <Nav className="mr-auto" navbar>
        <UncontrolledDropdown nav inNavbar isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle nav caret><FontAwesomeIcon icon="chart-line"/>{' '+this.props.d_name}</DropdownToggle>
          <SelectionDropDownController 
            objects = {this.props.objects}
            handleSelection = {this.props.handleSelection}  
            contentPage = {this.props.contentPage}
          >hey</SelectionDropDownController>
        </UncontrolledDropdown>
        
      </Nav>
    </Collapse>
  </Navbar>
  {this.state.rSelected =='sql' && !this.props.isHidden1 && <div id="hiddenDiv1" style={{height:"49px"}} color="dark" className="navbar navbar-dark bg-dark w-25 float-right" fixed="top" expand="md"></div>}
  {this.state.rSelected =='vis' && !this.props.isHidden2 && <div id="hiddenDiv2" style={{height:"49px"}} color="dark" className="navbar navbar-dark bg-dark w-25 float-right" fixed="top" expand="md"></div>}
  {this.state.rSelected =='dash' && !this.props.isHidden3 && <div id="hiddenDiv3" style={{height:"49px"}} color="dark" className="navbar navbar-dark bg-dark w-25 float-right" fixed="top" expand="md"></div>}
      </>
    )
  }
}

class EditTile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
      <i><small><font  color="#ffc107">editing tile </font></small></i>
      <Spacer></Spacer>
      <Button outline color="warning" className="float-left" onClick={this.props.submitEdit}><FontAwesomeIcon icon="check"/></Button>
      <Button outline color="warning" className="float-left" onClick={this.props.cancelEdit}><FontAwesomeIcon icon="times" size="lg"/></Button>
      </>
    )
  }
}

class SelectionDropDownController extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let addBack = <></>;
    let addNext = <></>;
    if (this.props.objects) {
      
      let pages = Math.floor(this.props.objects.length / 10.0)
      if (pages != 0) {
        if ( this.props.contentPage != 0 ) {
          addBack = <><DropdownItem key={'addBack'} onClick={this.props.handleSelection} type={'addBack'} toggle={false} data-id={this.props.contentPage} >Previous Page</DropdownItem></>
        }
        if ( this.props.contentPage != pages ) {
          addNext = <><DropdownItem key={'addNext'} onClick={this.props.handleSelection} type={'addNext'} toggle={false} data-id={this.props.contentPage} >Next Page</DropdownItem></>
        }
      }
    }

    let displayedObjects = this.props.objects.slice(this.props.contentPage * 10, (this.props.contentPage + 1) * 10) 
    displayedObjects = displayedObjects.sort(function(a,b){
      if (a.type != b.type ) {
        if (a.type == 'space') { 
          return -1 
        } else if (a.type=='favorite') { 
          return 1 
        }
      } else {
        if (a.name < b.name) { return -1 } else { return 1 }
      }
    });


    return (
    <>
        <SelectionDropdownList 
          objects = {displayedObjects}
          addBack = {addBack}
          addNext = {addNext}
          handleSelection = {this.props.handleSelection}  
        >hey</SelectionDropdownList>
    </>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.updateAppParams = this.updateAppParams.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.resetObjects = this.resetObjects.bind(this);
    this.updateDashboardElements = this.updateDashboardElements.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);

    this.state = {
      qid: this.props.qid,
      did: this.props.did,
      sql_slug: this.props.sql_slug,
      toggle: this.props.toggle,
      loading: true,
      isOpen: false,
      dropdownOpen: false,
      objects: [],
      d_name: 'select dashboard',
      reset_objects: [],
      isHidden1: false,
      isHidden2: false,
      isHidden3: false,
      contentPage: 0
    }
  }

  toggleHidden(which,way) {
    var returnObj = {};
    returnObj[which] = way;
    this.setState(returnObj);
  }

  updateDashboardElements(d_elements) {
    this.setState({
      d_elements: d_elements
    })
  }

  getObjects(){
    // let user = 1  ;
    apiCall('GET','/api/internal/core/3.1/user')
    .then(response => {
      let user = response.id
      let shared = apiCall('GET','/api/internal/dataflux/spaces','id=1')
      let my_space = apiCall('GET','/api/internal/dataflux/spaces','creator_id='+user+'&is_personal=true')
      let users = apiCall('GET','/api/internal/dataflux/spaces','is_users_root=true')
      // COME BACK HERE
      let favorites = apiCall('GET','/api/internal/core/3.1/content_favorite/search','user_id='+user)

      Promise.all([shared, my_space, users, favorites])
      .then(values => {
        let top_level = values.slice(0,3).map(space=>{
          if (space.length > 0) {
            var mapping = {
              type: 'space',
              id: space[0].id,
              name: space[0].name
            }
            return mapping
          }
        })
        for (var i=0; i<values[3].length; i++) {
          if (values[3][i].dashboard_id) {
            top_level.push({
              type: 'favorite',
              id: values[3][i].dashboard_id,
              name: values[3][i].dashboard.title
            })
          }
        }

        this.setState({
          reset_objects: top_level,
          objects: top_level
        })
      });
    })
  }

  resetObjects(){
    this.setState({
      objects: this.state.reset_objects,
      contentPage: 0
    })
  }
 
  componentDidMount() {
    this.getObjects()

    if (this.props.did && this.props.did != '' ) {
      apiCall('GET','/api/internal/core/3.1/dashboards/'+this.props.did)
      .then(response => {
        this.setState({ 
          d_name: response.title,
          d_elements: response.dashboard_elements
        })
        this.updateAppParams({did: response.id})
      })
    }
  }

  updateAppParams(obj) {
    this.setState(obj, ()=> {
      history.push({ 
        path: '/',
        search: 'qid=' + this.state.qid + '&sql_slug=' + this.state.sql_slug + '&toggle=' + this.state.toggle + '&did=' + this.state.did        
      })
    })
  }

  handleSelection(event) {
    const data_id = event.target.getAttribute("data-id")
    if (event.target.getAttribute("type") == 'addBack'){
      this.setState({ contentPage: parseInt(data_id, 10)-1});
    } else if (event.target.getAttribute("type") == 'addNext') {
      this.setState({ contentPage: parseInt(data_id, 10)+1});
    } else if (event.target.getAttribute("type") == 'space') {
      let spaceAPI = apiCall('GET','/api/internal/dataflux/spaces','parent_id='+data_id)
      let dashboardAPI = apiCall('GET','/api/internal/dataflux/dashboards','space_id='+data_id)
  
      Promise.all([spaceAPI, dashboardAPI])
      .then(([spaces, dashboards]) => {
        let sp = spaces.map(space=>{
          return {
            type: 'space',
            id: space.id,
            name: space.name
          }
        })
        let db = dashboards.map(dashboard=>{
          if (dashboard.can.update) {
            return {
              type: 'dashboard',
              id: dashboard.id,
              name: dashboard.title
            }
          }
        })
        sp = sp.filter(function (el) {return el != null;});
        db = db.filter(function (el) {return el != null;});
        this.setState({
          objects: sp.concat(db),
        })
      })
    } else if (event.target.getAttribute("type") == 'dashboard' || event.target.getAttribute("type") == 'favorite') {
      if (data_id != this.state.did) {
        this.setState({isHidden3: false})
      apiCall('GET','/api/internal/core/3.1/dashboards/'+data_id)
      .then(response => {
        this.setState({ d_elements: response.dashboard_elements })
      })
      // if (data_id != this.state.did) {
        this.setState({ d_name: event.target.value });
        this.updateAppParams({ did: data_id })
      }
    }
  }

  render() {   
    if (this.props.user_missing_permissions.length == 0) {
      return (
        <>
        <Navigator 
          objects={this.state.objects}
          updateAppParams={this.updateAppParams}
          handleSelection={this.handleSelection}
          d_name={this.state.d_name}
          qid={this.state.qid}
          did={this.state.did}
          sql_slug={this.state.sql_slug}
          toggle={this.state.toggle}
          resetObjects={this.resetObjects}
          d_elements={this.state.d_elements}
          updateDashboardElements={this.updateDashboardElements}
          toggleHidden={this.toggleHidden}
          isHidden1={this.state.isHidden1} isHidden2={this.state.isHidden2} isHidden3={this.state.isHidden3}
          contentPage={this.state.contentPage}
        ></Navigator>
        </>
        )
    } else {
      return (
        <div>Failed to Load Application, you do not have all of the necessary permissions
        (the necessary permissions are ['access_data', 'explore', 'use_sql_runner', 'see_user_dashboards', 'save_content'])</div>
      )
    }
  }
}

function SelectionDropdownList(props) {
  if (props.objects.length > 0) {
    const listItems = props.objects.map((object) => {
      var options = []
      if (object.type == 'dashboard') {
        options = [true, "chart-line"]
      } else if (object.type == 'favorite') {
        options = [true, "heart"]
      } else {
        options = [false, "folder-open"]
      }
      return (
        <DropdownItem 
          key={object.type+object.id}
          value={object.name}
          data-id={object.id}
          type={object.type}
          onClick={props.handleSelection}
          toggle={options[0]}
        ><FontAwesomeIcon 
          key={object.type+object.id}
          icon={options[1]} />{' '+object.name}</DropdownItem>
      )
    }
  
    );
    return (
      <DropdownMenu key={'selectionDropDown'}>
        {props.addBack}
        {listItems}
        {props.addNext}
      </DropdownMenu>
    );
  } else {
    return( 
      <DropdownMenu key={'selectionDropDown'}>
      <DropdownItem 
          key={'nothing'}
          value={'nothing'} 
          toggle={true}
      >
      Nothing in this space</DropdownItem>
      </DropdownMenu>
    )
  }
}

class Spacer extends Component {
  render() {
    return (
      <div style={{marginRight: "10px", marginLeft: "10px"}}><font color="white">|</font></div>
    )
  }
}

function readCookie(cookieName) {
  var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
  var sMatch = (' '+document.cookie).match(re);
  if (cookieName && sMatch) return unescape(sMatch[1]);
  return '';
}


function apiCall(method, path, queryParams, payload) {
  let url = [path, queryParams].join('?')
  let obj = { 
    method: method,
    headers: {
      "x-csrf-token": readCookie('CSRF-TOKEN')
    },
    body: JSON.stringify(payload)
  }
  return fetch(url, obj).then(
    response => response.json())
}

function createQuery(dynamic_query) {
	var body = {
		"model": dynamic_query.model,
		"view": "sql_runner_query",
    "fields": dynamic_query.selected,
    "sorts": dynamic_query.sorts,
    "dynamic_fields": JSON.stringify(dynamic_query.dynamic_fields),
    "vis_config": dynamic_query.vis_config
  };
  return body;
}

window.addEventListener('load', () => {
  const values = queryString.parse(document.location.search)
  var [ qid, toggle, sql_slug, did ] = [
    values.qid ? values.qid : '',
    values.toggle ? values.toggle : 'pik,vis',
    values.sql_slug ? values.sql_slug : '',
    values.did ? values.did : ''
  ]

  var user_check_promise = new Promise(function(resolve,reject){
    apiCall('GET','/api/internal/core/3.1/user')
    .then(response => {
      apiCall('GET','/api/internal/core/3.1/users/'+response.id+'/roles')
      .then(response => {
        let remaining_permissions = ['access_data', 'explore', 'use_sql_runner', 'see_user_dashboards', 'save_content']
        let permission_found = false;
        for (var o=0; o<remaining_permissions.length; o++) {
          permission_found = false;
          for (var i=0; i<response.length && !permission_found; i++) {
            let permissions = response[i].permission_set.permissions;
            for (var j=0; j<permissions.length && !permission_found; j++) {
              if (remaining_permissions[o].indexOf(permissions[j])!=-1) {
                permission_found = true;
                remaining_permissions[o] = ''
              }
            }
          }
        }
        remaining_permissions = remaining_permissions.filter(
          function(value) {
            return value !=''
        })
        resolve(remaining_permissions)
      })
    })
  })

  var sql_slug_promise = new Promise(function(resolve,reject) {
    if (qid != '' ) {
      apiCall('GET','/api/internal/core/3.1/queries/slug/'+qid)
      .then(response => {
        resolve( {
            sql_slug: response.model.replace('sql__',''),
            qid: qid
          }
        )
      })
    } else {
      resolve({
        sql_slug: sql_slug,
        qid: qid    
      })
    }
  })



  Promise.all([sql_slug_promise, user_check_promise])
  .then(values => {
    sql_slug = values[0].sql_slug
    qid = values[0].qid
    ReactDOM.render( <App 
      qid={qid}
      toggle={toggle}
      sql_slug={sql_slug}
      did={did}
      user_missing_permissions={values[1]}
    />, document.getElementById('app-container'));
   })
}, false); 



serviceWorker.unregister();