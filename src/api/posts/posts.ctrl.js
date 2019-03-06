const Post = require("models/post");
const { ObjectId } = require("mongoose");
const Joi = require("joi");

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};

exports.writes = async ctx => {
  const { title, body, tags } = ctx.request.body;

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (request.error) {
    ctx.status = 400;
    ctx.bodt = result.error;
    return;
  }

  const post = new Post({
    title,
    body,
    tags
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.trow(500, e); // 서버의 장애로 인해 발생하는 에러
  }
};
exports.list = async ctx => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.trow(500, e);
  }
};
exports.read = async ctx => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // 성공, 리턴은 없음.
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.update = async ctx => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string())
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (request.error) {
    ctx.status = 400;
    ctx.bodt = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true // 업데이트 한 후 객체를 받아옴. false일 경우 업데이트 되기전의 객체를 받아옴.
    }).exec();

    if (!post) {
      ctx.status = 204;
      return;
    }
    ctx.body = post;
  } catch (e) {
    e.throw(500, e);
  }
};
