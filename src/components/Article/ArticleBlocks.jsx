import React from 'react';
import PropTypes from 'prop-types';
import * as C from '../../constants/app';
import { convertPascalCase, getYoutubePreview } from '../../assets/js/helpers';

import VideoBlock from '../VideoBlock/VideoBlock';
import Interview from '../Interview/Interview';

const ArticleBlocks = {
  Paragraph: props => (
    <div dangerouslySetInnerHTML={{ __html: props.value }} />
  ),
  ImportantText: props => (
    <div className="article__text-frame-highlight" dangerouslySetInnerHTML={{ __html: props.value }} />
  ),
  Quote: props => (
    <blockquote className="article__blockquote">
      <div className="article__blockquote-title" dangerouslySetInnerHTML={{ __html: props.value.heading }} />
      <div className="article__blockquote-text" dangerouslySetInnerHTML={{ __html: props.value.text }} />
    </blockquote>
  ),
  Video: props => (
    <div className="article__attachment">
      <div className="article__attachment-content">
        <VideoBlock url={props.value.video} />
      </div>
      <div className="article__attachment-desc" dangerouslySetInnerHTML={{ __html: props.value.caption }} />
    </div>
  ),
  Image: props => (
    <div className="article__attachment">
      <div className="article__attachment-content">
        <img src={`${C.URL_API}${props.value.photo.original.src}`} alt={props.value.photo.original.alt} />
      </div>
      <div className="article__attachment-desc" dangerouslySetInnerHTML={{ __html: props.value.caption }} />
    </div>
  ),
  RelatedVideos: (props) => {
    const link = props.value;
    const urlPreview = getYoutubePreview(link) || null;
    return (
      <a href={link} className="article-video-link" target="_blank">
        <div className="article-video-link__preview">
          {urlPreview && <img src={urlPreview} alt="" className="article-video-link__img" />}
        </div>
      </a>
    );
  },
  Thesis: props => (
    <div className="article__text-note" dangerouslySetInnerHTML={{ __html: props.value }} />
  ),
  ExpertOpinion: props => (
    <div className="article-opinion">
      <div className="article-opinion__title">Мнение эксперта</div>
      <div className="article-opinion__author">
        <div className="article-opinion__author-face-wrap">
          {props.value.photo && (
            <div className="article-opinion__author-img-wrap">
              <img src={`${C.URL_API}${props.value.photo.thumbnail.src}`} alt={props.value.photo.thumbnail.alt} className="article-opinion__author-img" />
            </div>
          )}
          <div className="article-opinion__author-name">{props.value.full_name}</div>
        </div>
        {props.value.position && <div className="article-opinion__author-role">{props.value.position}</div>}
      </div>
      <div className="article-opinion__text" dangerouslySetInnerHTML={{ __html: props.value.text }} />
    </div>
  ),
  AdvertisingBanner: (props) => {
    let el = null;
    if (props.value.link) {
      el = (
        <a href={props.value.link}>
          <img src={`${C.URL_API}${props.value.original.src}`} alt={props.value.original.alt} />
        </a>
      );
    } else {
      el = (
        <div>
          <img src={`${C.URL_API}${props.value.original.src}`} alt={props.value.original.alt} />
        </div>
      );
    }
    return el;
  },
  Quiz: props => (
    <Interview
      results={props.articleQuizes || null}
      className="article__interview"
      question={props.value.title}
      answers={props.value.possible_answers}
      type={props.value.type}
      id={props.value.id}
      onSubmit={props.onSubmit}
    />
  ),
  TwoColumn: (props) => {
    const {
      left_column: propsLeftColumn = [],
      right_column: propRightColumn = [],
    } = props.value;

    let [leftColumn, rightColumn] = [null, null];

    if (propsLeftColumn.length) {
      leftColumn = (
        <div className="article__text-wrap article__text-wrap_left">
          {propsLeftColumn.map((block) => {
            const componentName = convertPascalCase(block.type);
            const Component = ArticleBlocks[componentName];

            if (!Component) return null;
            if (componentName === 'Quiz') {
              return (
                <Component
                  value={block.value}
                  id={block.id}
                  key={block.id}
                  onChange={props.quizOnChange}
                  articleQuizes={props.articleQuizes}
                />
              );
            }
            return <Component value={block.value} id={block.id} key={block.id} />;
          })}
        </div>
      );
    }
    if (propRightColumn.length) {
      rightColumn = (
        <div className="article__side-wrap">
          {propRightColumn.map((block) => {
            const Component = ArticleBlocks[convertPascalCase(block.type)];

            if (!Component) return null;
            return (<Component value={block.value} id={block.id} key={block.id} />);
          })}
        </div>
      );
    }

    return (
      <div className="article__row">
        {rightColumn}
        {leftColumn}
      </div>
    );
  },
};

ArticleBlocks.Paragraph.propTypes = {
  value: PropTypes.string,
};
ArticleBlocks.Paragraph.defaultProps = {
  value: '',
};

ArticleBlocks.ImportantText.propTypes = {
  value: PropTypes.string,
};
ArticleBlocks.ImportantText.defaultProps = {
  value: '',
};

ArticleBlocks.Quote.propTypes = {
  value: PropTypes.shape({
    heading: PropTypes.string,
    text: PropTypes.string,
  }),
};
ArticleBlocks.Quote.defaultProps = {
  value: {
    heading: '',
    text: '',
  },
};

ArticleBlocks.Video.propTypes = {
  value: PropTypes.shape({
    video: PropTypes.string,
    caption: PropTypes.string,
  }),
};
ArticleBlocks.Video.defaultProps = {
  value: {
    video: '',
    caption: '',
  },
};

ArticleBlocks.Image.propTypes = {
  value: PropTypes.shape({
    photo: PropTypes.shape({
      original: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string,
      }),
    }),
    caption: PropTypes.string,
  }),
};
ArticleBlocks.Image.defaultProps = {
  value: {
    photo: {
      original: {
        src: '',
        alt: '',
      },
    },
    caption: '',
  },
};

ArticleBlocks.RelatedVideos.propTypes = {
  value: PropTypes.string,
};
ArticleBlocks.RelatedVideos.defaultProps = {
  value: '',
};

ArticleBlocks.Thesis.propTypes = {
  value: PropTypes.string,
};
ArticleBlocks.Thesis.defaultProps = {
  value: '',
};

ArticleBlocks.ExpertOpinion.propTypes = {
  value: PropTypes.shape({
    photo: PropTypes.shape({
      thumbnail: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string,
      }),
    }),
    full_name: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string,
  }),
};
ArticleBlocks.ExpertOpinion.defaultProps = {
  value: {
    photo: {
      thumbnail: {
        src: '',
        alt: '',
      },
    },
    full_name: '',
    position: '',
    text: '',
  },
};

ArticleBlocks.Quiz.propTypes = {
  articleQuizes: PropTypes.arrayOf(
    PropTypes.string,
  ),
  value: PropTypes.shape({
    possible_answers: PropTypes.array,
    title: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.number,
  }),
  id: PropTypes.string,
  onSubmit: PropTypes.func,
};
ArticleBlocks.Quiz.defaultProps = {
  articleQuizes: [],
  value: {
    possible_answers: [],
    title: '',
    type: '',
    id: 0,
  },
  id: '',
  onSubmit: () => {},
};

ArticleBlocks.TwoColumn.propTypes = {
  value: PropTypes.shape({}),
};
ArticleBlocks.TwoColumn.defaultProps = {
  value: {},
};

export default ArticleBlocks;
