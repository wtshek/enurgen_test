# How to build and run the microservices?

1. Run the command `docker build -t <NAME> .`
2. Run the command `docker run -p PORT:3000 `

# How to test the microservices?

1. Open Postman
2. Send a POST request to `http://localhost:3000/extract-rect-coords`. Choose `form-data` in Body tab, set a field call `image` and attach the image
3. You should see the response
