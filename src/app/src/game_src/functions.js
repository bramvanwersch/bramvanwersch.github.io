
function nextImage(img_object, change, total_images, base_image_name){
    var newValue = (parseInt(img_object.dataset.nr) + change)
    if (newValue < 0){
        newValue = total_images -1
    }
    else if (newValue >= total_images){
        newValue = 0
    }
    img_object.dataset.nr = newValue
    img_object.src = "data/" + base_image_name + newValue + ".png"
}
