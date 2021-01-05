var db = firebase.firestore();

const vueApp = new Vue({
    el: '#vue-container',
    data: {
        hola: "jeje",
        marcaSel: "",
        modeloSel: "",
        // Mock de datos :B
        marcas: [{
            "id": 1,
            "nombre": "Samsung"
        }, {
            "id": 2,
            "nombre": "Huawey"
        }],
        modelos: [{
                "id": 1,
                "nombre_modelo": "Galaxy",
                "anio": 2019,
                "id_marca": 1
            }, {
                "id": 2,
                "nombre_modelo": "A11",
                "anio": 2021,
                "id_marca": 1
            },
            {
                "id": 3,
                "nombre_modelo": "P30",
                "anio": 2000,
                "id_marca": 2
            }, {
                "id": 4,
                "nombre_modelo": "P20",
                "anio": 1998,
                "id_marca": 2
            }
        ],
        nuevaMarca: "",
        newModeloNom: "",
        fotoFiles: [],
        fotoTmp: [],

    },


    methods: {
        fetchMarca() {
            this.marcas = [];
            db.collection("marca").get().then((docs) => {
                docs.forEach((docu) => {
                    this.marcas.push({
                        "id": docu.id,
                        "nombre": docu.data().nombre
                    });
                });
            });
        },

        fetchModelo() {
            this.modelos = [];
            this.newModeloNom = "";
            db.collection("modelo").get().then((docs) => {
                docs.forEach((docu) => {
                    this.modelos.push({
                        "id": docu.id,
                        "nombre_modelo": docu.data().nombre_modelo,
                        "id_marca": docu.data().id_marca,
                    });
                });
            });
        },

        agregarNuevaMarca() {
            db.collection("marca").add({
                nombre: this.nuevaMarca
            }).then(function (docRef) {
                vueApp.fetchMarca();
                vueApp.marcaSel = "";
                console.log("El documento se ha escrito y su id es: ", docRef.id);
            }).catch(function (error) {
                console.error("Error al tratar de agregar el documento", error);
            });
        },

        eliminarMarca() {
            db.collection("marca").doc(this.marcaSel.id).delete().then(function (docRef) {
                vueApp.fetchMarca();
                vueApp.marcaSel = "";
                console.log("El documento se ha eliminado exitosamente ");
            }).catch(function (error) {
                console.error("Error al eliminar el documento", error);
            });
            console.log("se elimino xd ");
        },

        agregarNuevoModelo() {
            db.collection("modelo").add({
                nombre_modelo: this.newModeloNom,
                id_marca: this.marcaSel.id
            }).then(function (docRef) {
                vueApp.fetchModelo();
                vueApp.modeloSel = vueApp.newModeloNom;
                console.log("El documento se ha escrito y su id es: ", docRef.id);
            }).catch(function (error) {
                console.error("Error al tratar de agregar el documento", error);
            });
        },
        eliminarModelo() {
            db.collection("modelo").doc(this.modeloSel.id).delete().then(function (docRef) {
                vueApp.fetchModelo();
                vueApp.modeloSel = "";
                console.log("El documento se ha eliminado exitosamente ");
            }).catch(function (error) {
                console.error("Error al eliminar el documento", error);
            });
        },

        readURL(input) {
            Array.from(input.target.files).forEach((a) => {
                if (
                    a.type != "image/jpeg" &&
                    a.type != "image/png" &&
                    a.type != "image/gif"
                ) {
                    console.log("No se pudo subir el documento: ",a.name, "no tiene formato de imagen");
                } else {
                    this.fotoFiles.push(a);
                    var fileObject = a;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(fileObject);
                    fileReader.onload = function () {
                        vueApp.fotoTmp.push({
                            "url": fileReader.result,
                            "name": a.name
                        });
                    };
                }
            });
        },

        removeUpload(img) {
            // $(".file-upload-input").replaceWith($(".file-upload-input").clone());
            // $(".file-upload-content").hide();
            // $(".image-upload-wrap").show();
            let index = this.fotoTmp.indexOf(img);
            if (index > -1) {
                this.fotoTmp.splice(index, 1);
                this.fotoFiles.splice(index, 1);
            }
        },

        async imagenUrl(fileObject) {
            console.log(fileObject)
            var fileReader = new FileReader();
            fileReader.readAsDataURL(fileObject);
            fileReader.onload = await
            function () {
                console.log(fileReader.result)

                return fileReader.result;
            };
        }
    },

    computed: {

    },
    mounted: function () {
        console.log("iniciado");

        // this.fetchMarca();
        // this.fetchModelo();
    },

});

//------------------------------------------
// var input = document.querySelector("#file-input");

// document.querySelector("button").addEventListener("click", function () {
//   input.click();
// });

// input.addEventListener("change", preview);

// function preview() {
//   console.log(this.files,'\n',this.files[0]);
//   Array.from(this.files).forEach((a) => {
//       console.log(a);
//     if (
//       a.type != "image/jpeg" &&
//       a.type != "image/png" &&
//       a.type != "image/gif"
//     ) {
//       alert("No se pudo subir la imagen");
//     } else {
//       var fileObject = a;
//       var fileReader = new FileReader();
//       fileReader.readAsDataURL(fileObject);
//       fileReader.onload = function () {
//         var para = document.createElement("img");
//         var result = fileReader.result;
//         var img = document.querySelector("#preview");
//         para.setAttribute("src", result);
//         img.appendChild(para);
//       };
//     }
//   });
// }


// {
/* <input type='file' id='file-input' hidden multiple>
<div id='container'>
  <button>Select an image</button>
  <p id='preview'>Preview</p>
</div> */
// }