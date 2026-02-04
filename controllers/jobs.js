const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");


const getAllJobs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(queryObject)
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / Number(limit));

  res.status(StatusCodes.OK).json({
    jobs,
    totalJobs,
    numOfPages,
  });
};


const getJob = async (req, res) => {
  const {user: { userId }, params: { id: jobId } } = req;
  
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
     params: { id: jobId },
      body: { company, position } 
    } = req;

  if (!company  || !position ) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  
const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Job deleted" });
};



module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
