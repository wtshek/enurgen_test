# What does this microservices do?

User can send a POST request to the service with image attached to get the coordinates of the rectangle. The image should follow these two prerequisites:

1. Only black and white image are follow
2. Image should contain only the rectangle(s)

# How to build and run the microservices?

1. Run the command `docker build -t <NAME> .`
2. Run the command `docker run -p PORT:3000 `

# How to test the microservices?

1. Open Postman
2. Send a POST request to `http://localhost:3000/extract-rect-coords`. Choose `form-data` in Body tab, set a field call `image` and attach the image
3. You should see the response

# Response

```
[
    {
        "id": 0,
        "coordinates": [
            [
                387,
                56
            ],
            [
                437,
                56
            ],
            [
                387,
                456
            ],
            [
                437,
                456
            ]
        ]
    },
    {
        "id": 1,
        "coordinates": [
            [
                231,
                56
            ],
            [
                281,
                56
            ],
            [
                231,
                456
            ],
            [
                281,
                456
            ]
        ]
    },
    {
        "id": 2,
        "coordinates": [
            [
                75,
                56
            ],
            [
                125,
                56
            ],
            [
                75,
                456
            ],
            [
                125,
                456
            ]
        ]
    }
]

```
