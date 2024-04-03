# **The problem**

- Keeping data synchronized across multiple locations.

## Data that needs to be synchronized:

- Computation Image
- Computation code
- Computation meta such as readme or parameter definitions

## Locations:

- Computation repository
- COINSTAC database
- Image registry
- Central server
- Site

## Example

A computation author changes the code on their local machine, builds the image, submits it to the image registry. Now, the meta information about the computation in the database doesn't match the image being used, making it not start. Rebuilding the image from the repo doesn't have any of the current changes. The sites and server might have older versions of the image and the computation meta doesn't work with their images either.

# **The solution**

Keeping the versions synchronized and tagged.
- Use semantic versioning
- Make sure every image in the registry has a version number and that is paired with an identically tagged GitHub release.

We could add github actions to do certain things when a release is published:
- build an image for the new version and push it to the registry
- submit the new versions computation meta to the COINSTAC database