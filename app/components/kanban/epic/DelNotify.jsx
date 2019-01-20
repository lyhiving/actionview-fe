import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormGroup, Radio } from 'react-bootstrap';
import Select from 'react-select';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const loadimg = require('../../../assets/images/loading.gif');

export default class DelNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, operate_flg: '0', swapEpic: '' };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    epics: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, del, index, data } = this.props;
    const ecode = await del(_.extend({}, { id: data.id }, { operate_flg: this.state.operate_flg, swap_epic: this.state.swapEpic }));
    if (ecode === 0) {
      close();
      notify.show('删除完成。', 'success', 2000);
      index();
    }
    this.setState({ ecode: ecode });
  }

  cancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    close();
  }

  render() {
    const { i18n: { errMsg }, data, epics, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>删除Epic - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { data.is_used ?
          <div className='info-col' style={ { marginTop: '5px' } }>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>有问题和此Epic关联，请选择以下操作。</div>
          </div>
          :
          <div className='info-col' style={ { marginTop: '5px' } }>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>没有问题和此Epic关联，可放心删除。</div>
          </div> }
          { data.is_used && 
          <div style={ { margin: '20px 10px 10px 10px' } }>
            <div style={ { display: 'inline-block', verticalAlign: 'top' } }>修复问题</div>
            <div style={ { display: 'inline-block', marginLeft: '20px' } }>
              <FormGroup>
                <Radio
                  inline
                  name='swap'
                  onClick={ () => { this.setState({ operate_flg : '1' }) } }
                  checked={ this.state.operate_flg === '1' }>
                  移动至Epic
                </Radio>
                <div style={ { width: '300px', margin: '5px 5px 10px 18px' } }>
                  <Select
                    simpleValue
                    clearable={ false }
                    disabled={ this.state.operate_flg !== '1' }
                    options={ _.map(_.reject(epics, { id: data.id } ), (v) => ({ value: v.id, label: v.name }) ) }
                    value={ this.state.swapEpic }
                    onChange={ (newValue) => { this.setState({ swapEpic: newValue }) } }
                    placeholder='选择Epic'/>
                </div>
                <Radio
                  inline
                  name='remove'
                  onClick={ () => { this.setState({ operate_flg : '2' }) } }
                  checked={ this.state.operate_flg === '2' }>
                  移除Epic
                </Radio>
              </FormGroup>
            </div>
          </div> }
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ loadimg } className={ loading ? 'loading' : 'hide' }/>
          <Button
            onClick={ this.confirm }
            disabled={ loading || (data.is_used && this.state.operate_flg === '0') || (this.state.operate_flg === '1' && !this.state.swapEpic) }>
            确定
          </Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
