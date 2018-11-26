for i in *jpg;do convert -resize 1280x -strip -interlace Plane -quality 70 $i `echo $i | sed 's/.jpg/-small.jpg'`;done
