import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Icon from 'Icon'
import * as dcopy from 'deep-copy';
import {getCookie} from 'helpers';
import Notification from '../Notification/Notification';
import { lang } from '../../assets/js/lang';
import './fileuploader.css';


export class FilePreview extends Component{
    onRemove(){
        if (this.props.onRemove && this.props.source){
          this.props.onRemove(this.props.source.name)
        } else if (!this.props.onRemove && this.props.source) {
          removeFileFromServer(this.props.url, this.props.source.id);
          this.fileAttach.parentNode.innerHTML = '';
        }
    }
    render(){
        let {type='binary', source:{id, src, isLoad, name, noEdit}, } = this.props;
        let element = null;

        let srcPreview = null;
        if (src) {
          srcPreview = src.indexOf('data:image') > -1 ? src : `${API_URL}${src}`;
        } else {
          srcPreview = src;
        }

        if (type === 'image'){
            element = (
                <div ref={(d) => { this.fileAttach = d; }} className={`fileuploader__file fileuploader__file_image ${noEdit ? 'fileuploader__file_image-nohover' : ''} ${isLoad ? '' : 'state-uploading'}`}  >
                    {isLoad ? <input type="hidden" name="id_for_attachment" id={id} value={id} /> : <input type="hidden" name="no_load" />}
                    <div className="fileuploader__file-img-wrap">
                        <img alt="" src={srcPreview} className="fileuploader__file-img" />
                    </div>
                    {!noEdit ? <div className="fileuploader__file-remove" onClick={::this.onRemove}></div> : ''}
                </div>
            )
        } else {
            let extFile = name.match(/\.([^.]+)$/)[1].toLowerCase();
            let iconMod = '';
            switch (extFile){
                case 'doc':
                case 'docx': iconMod = 'doc';
                break;
                case 'xls':
                case 'xlsx': iconMod = 'xls';
                break;
                case 'ppt':
                case 'pptx': iconMod = 'ppt';
                break;
                case 'pdf': iconMod = 'pdf';
                break;
                default: iconMod = 'noname';
            }
            if (noEdit) {
              element = (
                  <a href={srcPreview} target="_blank" className={`fileuploader__file fileuploader__file_binary ${isLoad ? '' : 'state-uploading'}`} ref={(d) => { this.fileAttach = d; }}>
                      <Icon className='fileuploader__file-icon' icon={`file_${iconMod}_color`}/>
                      {isLoad ? <input type="hidden" name="id_for_attachment" id={id} value={id} /> : <input type="hidden" name="no_load" />}
                      <span className="fileuploader__file-name">
                          {name}
                      </span>
                  </a>
              )
            } else {
              element = (
                <div className="comment__fileloader-list-item" ref={(d) => { this.fileAttach = d; }}>
                  <div className={`fileuploader__file fileuploader__file_binary ${isLoad ? '' : 'state-uploading'}`} >
                      <Icon className='fileuploader__file-icon' icon={`file_${iconMod}_color`}/>
                      {isLoad ? <input type="hidden" name="id_for_attachment" id={id} value={id} /> : <input type="hidden" name="no_load" />}
                      <span className="fileuploader__file-name">
                          {name}
                          <div className="fileuploader__file-remove" onClick={::this.onRemove}></div>
                      </span>
                  </div>
                </div>
              )
            }
        }
        return element;
    }
}

export default class FileUploader extends Component {
    constructor(props) {
        super(props);

        this.mimeTypes = {
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            txt: 'text/plain',
            odt: 'application/vnd.oasis.opendocument.text',
            ods: 'application/vnd.oasis.opendocument.spreadsheet',
            odp: 'application/vnd.oasis.opendocument.presentation',
            pdf: 'application/pdf',
            bmp: 'image/bmp',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            zip: 'application/zip',
            mpeg: 'video/mpeg',
            mp4: 'video/mp4',
        }
        this.mimeGroup = {
            images: ['gif','png','jpg','jpeg']
        }

        this.state = {
            extensions: [],
            files: [],
            buttonDisable: false,
            dropzone: '',
            errorText: '',
        };
    }

    componentWillReceiveProps(nextProps){
        let {extensions=[], files} = nextProps
        if (typeof extensions === 'string'){
            extensions = extensions.split(',')
        }
        let nextState = {
            extensions: extensions
        }
        if (files && Array.isArray(files))
            nextState.files = files

        this.setState(nextState)
    }
    componentDidMount(){
        let {extensions=[], files} = this.props
        if (typeof extensions === 'string'){
            extensions = extensions.split(',')
        }

        let nextState = {
            extensions: extensions
        }
        if (files && Array.isArray(files))
            nextState.files = files

        this.setState(nextState)
    }

    isFileImage(file) {
        let extFile = file.name.match(/\.([^.]+)$/)[1].toLowerCase();
        if (this.mimeGroup.images.indexOf(extFile) !== -1){
            return true
        } else {
            return false
        }
    }
    handleFiles(files) {
        let self         = this;
        let URL          = this.props.url;
        let arrFiles     = Array.from(files);
        let stateFiles   = dcopy(self.state.files);

        arrFiles.forEach((itemFile)=>{
            let isExsist = false;
            let arrInd = 0;
            let stateFile = {
                id: null,
                name: itemFile.name || '',
                isLoad: false,
                src: null
            }
            stateFiles.forEach((tempItem, tempItemInd) => {
                if (tempItem.name === stateFile.name) {
                    isExsist = true;
                    arrInd = tempItemInd;
                    return false;
                }
            });


            //Если изображение, то показываем превью
            if ( self.isFileImage(itemFile) ){
                let reader = new FileReader();

                reader.onload = function(eventReader){
                    stateFile.src = eventReader.target.result;

                    if (isExsist)
                        stateFiles[arrInd] = stateFile;
                    else
                        stateFiles.push(stateFile);

                    self.updateFiles(stateFiles)

                    fetchData(URL, itemFile, stateFiles)

                }
                reader.readAsDataURL(itemFile);

            //Если не изображение сразу грузим на сервер
            } else {
                if (isExsist)
                    stateFiles[arrInd] = stateFile;
                else
                    stateFiles.push(stateFile);

                self.updateFiles(stateFiles)

                fetchData(URL, itemFile, stateFiles)
            }

        })

        function fetchData(URL, itemFile, stateFiles){
            let formData = new FormData();
            formData.append('file', itemFile);

            fetch(URL, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Forwarded-Host': `${THEME.host}`,
                },
                body: formData,
                credentials: 'include'
            })
            .then(responce => {
                return responce.json().then(json => ({ data: json, ok: responce.ok }));
            })
            .then(({ data, ok }) => {
              let curIndItem = null;
              stateFiles.forEach((item, ind)=>{
                  if (item.name === itemFile.name){
                      curIndItem = ind;
                      return false;
                  }
              })
              if (ok) {
                  stateFiles[curIndItem].isLoad = true
                  stateFiles[curIndItem].id = data.id
                  self.setState({ errorText: false });
              } else {
                self.setState({ errorText: data.detail });

                // setTimeout(() => {
                //   debugger;
                //   self.setState({ errorText: '' });
                // }, 5000);
                stateFiles.splice(curIndItem, 1)
              }
              self.updateFiles(stateFiles)
              self.setState({ buttonDisable: false });
            })
            .catch(error => {
                self.setState({ errorText: data.detail });
                stateFiles.forEach((item, ind)=>{
                    if (item.name === itemFile.name){
                        stateFiles.splice(ind, 1)
                        return false;
                    }
                })
                self.updateFiles(stateFiles);
                self.setState({ buttonDisable: false });
            })
        }

    }

    onChange(e) {
        let files = e.target.files;
        if (this.state.buttonDisable) {
          alert('Дождитесь загрузки приложенного файла')
          return false;
        }
        if (!files.length) return;
        this.handleFiles.call(this, files);
        this.setState({ buttonDisable: true });
    }

    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        if (!files.length) return;

        this.handleFiles.call(this, files);

        this.setState({
            dropzone: ''
        });
    }
    onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
        let cont = this.refs.dropzoneContainer;
        cont.style.pointerEvents = 'none';

        this.setState({
            dropzone: 'dragenter'
        });
    }

    onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            dropzone: ''
        });
    }

    getCurMimeTypesString(){
        let str = '';
        this.state.extensions.forEach((item, ind, arr)=>{
            let type = item;
            if (this.mimeTypes[item])
                type = this.mimeTypes[item]

            if (ind !== arr.length - 1)
                type += ', '

            str += type
        })
        return str;
    }

    onRemoveFile(curName){
        let newFiles = dcopy(this.state.files);
        let id;

        newFiles.forEach((item, ind)=>{
            if (item.name === curName){
                id = newFiles[ind].id;
                newFiles.splice(ind, 1)
                return false;
            }
        })

        this.updateFiles(newFiles)

        // вставлю-ка я сюда костыль, раз такая тема пошла
        removeFileFromServer(this.props.url, id);
    }

    renderFiles(){
        let images = []
        let binary = []
        let self = this;

        return (
            <div className="fileuploader__files">
                {this.state.files.map((item, ind) => {
                  return (
                    <div className={self.isFileImage(item) ? "fileuploader__files-images" : "fileuploader__files-binary"} key={item.name}>
                      <FilePreview source={item} type={self.isFileImage(item) ? "image" : ''} onRemove={::this.onRemoveFile} />
                    </div>
                  )
                })}
                {this.state.errorText ? <div className="fileuploader__error">{this.state.errorText}</div> : ''}
            </div>
        )

    }

    updateFiles(files, cb){
        this.setState({
            files: files
        }, () => {
            if (this.props.onUpdateFiles)
                this.props.onUpdateFiles(files);
        })

    }
    render() {
        let labelMain = this.props.lableMain || (<span dangerouslySetInnerHTML={{__html: lang('file','instruction')}}></span>)
        let labelMainMobile = this.props.lableMainMobile || (<span>{lang('file','download')}</span>)
        let labelSecond = this.props.labelSecond || null
        return (
            <div className="fileuploader">

                <label
                    className={`fileuploader__dropzone ` + this.state.dropzone}
                    onDragEnter={::this.onDragEnter}
                    onDragOver={::this.onDragOver}
                    onDrop={::this.onDrop}
                    onDragLeave={::this.onDragLeave}
                >
                    <div className="fileuploader__dropzone-container" ref="dropzoneContainer">
                        <div className="fileuploader__dropzone-content">
                            {labelMain &&
                            <div className="fileuploader__label fileuploader__label_main">{labelMain}</div>}

                            {labelMainMobile &&
                            <div className="fileuploader__label fileuploader__label_main fileuploader__label_mobile">{labelMainMobile}</div>}

                            {labelSecond &&
                            <div className="fileuploader__label fileuploader__label_second">{labelSecond}</div>}
                        </div>


                        <input
                            type="file"
                            multiple
                            accept={this.getCurMimeTypesString()}
                            className="fileuploader__field"
                            onChange={::this.onChange}
                        />
                    </div>
                </label>

                {labelSecond && <div className="fileuploader__label fileuploader__label_second fileuploader__label_mobile">{labelSecond}</div>}

                {this.renderFiles()}
            </div>
        );
    }
}
export class FileUploaderAttachment extends FileUploader{
    updateFiles(files, cb){
        this.setState({
            files: files
        }, () => {
            if (this.props.onUpdateFiles)
                this.props.onUpdateFiles(files);
            //Чтобы можно было рендерить превью файлов в любом месте родительского компонента
            if (this.props.getRenderFiles)
                this.props.getRenderFiles(this.renderFiles());
        })
    }

     render() {
        let {className: classMod='', } = this.props;
        return (
            <div className={`fileuploader fileuploader_attachment ${classMod}`}>

                <label
                    className={`fileuploader__dropzone ` + this.state.dropzone}
                    onDragEnter={::this.onDragEnter}
                    onDragOver={::this.onDragOver}
                    onDrop={::this.onDrop}
                    onDragLeave={::this.onDragLeave}
                >
                    <div className="fileuploader__dropzone-container" ref="dropzoneContainer">
                        <div className="fileuploader__dropzone-content">

                        </div>


                        <input
                            type="file"
                            multiple
                            accept={this.getCurMimeTypesString()}
                            className="fileuploader__field"
                            onChange={::this.onChange}
                        />
                    </div>
                </label>


            </div>
        );
    }
}

function removeFileFromServer(url, id) {
  fetch(`${url}${id}/`, {
      method: 'DELETE',
      headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include'
  })
  .then(responce => {
      return responce.json().then(json => ({ data: json, ok: responce.ok }));
  })
  .then(({ data, ok }) => {

  })
  .catch(error => {
  });
}
