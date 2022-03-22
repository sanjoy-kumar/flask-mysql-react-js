import React, { useState } from 'react';
import { Grid, TextField, Button, Card, CardContent, Typography, Avatar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ImageList, ImageListItem, ImageListItemBar, CardActionArea } from '@mui/material';
import axios from "axios";
import '../ContactForm.css';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#EE7600"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "red"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple"
    }
  }
});



const ContactForm = () => {
  const classes = useStyles();

  const countries = [
    {
      img: require('../images/canada.jpg'),
      title: 'Canada',
      featured: true,
    },
    {
      img: require('../images/usa.jpg'),
      title: 'USA',
    }
  ];

  const [formData, updateFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    job_title: "",
    country: ""
  });

  const img = require('../images/profileImage.jpg');
  const [picture, setPicture] = useState(img);
  const [imgData, setImgData] = useState(img);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };


  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
        localStorage.setItem("recent-profile-image", reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

 
  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log(formData);
    if (formData.first_name && formData.last_name && formData.phone_number && formData.job_title) {
      axios
        .post('http://127.0.0.1:5000/contactinfo', formData)
        .then((res) => {
          //console.log(res["data"]);
          const {
            data: { error, id, first_name, last_name, phone_number, job_title, country },
          } = res;

          //console.log(res);

          if (Object.keys(res["data"]).length > 1) {
            // if data inserted into MySQL Database succesfully.
            // localStorage('first_name', last_name, phone_number, job_title, country);
            localStorage.setItem("error", '');
            localStorage.setItem("id", id);
            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name)
            localStorage.setItem("phone_number", phone_number)
            localStorage.setItem("job_title", job_title)
            localStorage.setItem("country", country)
            //const key = localStorage.getItem("id");
            //window.location = '/UpdateContactForm?id='+key;

          } else {
            // if data is not inserted into MySQL Database due to duplicate value.
            localStorage.setItem("error", error);
            localStorage.setItem("id", '');
            localStorage.setItem("first_name", '');
            localStorage.setItem("last_name", '')
            localStorage.setItem("phone_number", '')
            localStorage.setItem("job_title", '')
            localStorage.setItem("country", '')
            window.alert(error);
            window.location = '/';
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };




  return (
    <div className="ContactForm">
      <Grid>
        <Card style={{ maxWidth: 600, backgroundColor: "#FAF9FF", padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <form autoComplete="off" onSubmit={handleSubmit}>

              <Grid xs={12}>
                <Typography gutterBottom variant="h5">
                  Edit your Contact Information
                  &nbsp; &nbsp; &nbsp;
                  <Button type="submit" style={{ color: 'white', backgroundColor: '#EE7600', width: '160px' }} variant="contained" >Save</Button>
                </Typography>
              </Grid>

              <IconButton>
                <Avatar
                  src={imgData}
                  style={{
                    width: "150px",
                    height: "150px",
                  }}
                />
                <Fab size="small" sx={{ backgroundColor: '#EE7600', color: 'white' }} aria-label="edit">
                  <label>
                    <EditIcon />
                    <input id="getFile" style={{ display: 'none' }} type="file" onChange={handleImageChange} />
                  </label>
                </Fab>
              </IconButton>

              <Grid container spacing={1}>
                <Grid xs={12} sm={6} item>
                  <label>First Name</label>
                  <TextField className={classes.root} placeholder="First name" variant="outlined" fullWidth name="first_name" value={formData.first_name} onChange={handleChange} required />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <label>Last Name</label>
                  <TextField className={classes.root} placeholder="Last name" variant="outlined" fullWidth name="last_name" value={formData.last_name} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12}>
                  <label>Phone Number</label>
                  <TextField className={classes.root} type="tel" placeholder="(123) 456-7891" variant="outlined" fullWidth name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12}>
                  <label>Job Title</label>
                  <TextField className={classes.root} placeholder="Chief Financial Officer" variant="outlined" fullWidth name="job_title" value={formData.job_title} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12}>
                  <label>Country</label>
                  <ImageList sx={{ width: 600, height: 140 }} cols={4} gap={8}>
                    {countries.map((item) => (
                      <CardActionArea name="country" value={formData.country} onChange={handleChange}>
                        <ImageListItem key={item.img} variant="outlined" >

                          <img
                            src={`${item.img}?w=80&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=80&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                          />
                          <ImageListItemBar
                            title={item.title}
                            position="below"
                          />

                        </ImageListItem>
                      </CardActionArea>
                    ))}
                  </ImageList>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>

  );
};

export default ContactForm;
