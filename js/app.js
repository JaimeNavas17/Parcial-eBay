var db = firebase.firestore();
var storageRef = firebase.storage().ref();

const vueApp = new Vue({
    el: '#vue-container',
    data: {
        hola: "jeje",
        marcaSel: "",
        modeloSel: "",
        // Mock de datos :B
        marcas: [{
            "id": 1,
            "nombre": "Samsung",
            "checked": false
        }, {
            "id": 2,
            "nombre": "Huawey",
            "checked": false
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
        so: ["IOS", "Windows", "Android", "Blackberry", "Otro"],
        anuncio: {
            "compania_tel": "",
            "Screen_size": 0,
            "ram": 0,
            "rom": 0,
            "estado": "",
            "descripcion": "",
            "precio": 0,
            "sistema": "",
            "nombreVendedor": "",
            "id_modelo": "",
            "titulo": "",
            "telVendedor": "",
            "fotos": [],
            "fecha": ""
        },
        pasoModal: 1,
        anuncios: []
    },


    methods: {
        fetchMarca() {
            this.marcas = [];
            db.collection("marca").get().then((docs) => {
                docs.forEach((docu) => {
                    this.marcas.push({
                        "id": docu.id,
                        "nombre": docu.data().nombre,
                        "checked": false
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
                    console.log("No se pudo subir el documento: ", a.name, "no tiene formato de imagen");
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
            let index = this.fotoTmp.indexOf(img);
            if (index > -1) {
                this.fotoTmp.splice(index, 1);
                this.fotoFiles.splice(index, 1);
            }
        },

        async uploadImages(file, cb) {
            const fileRef = storageRef.child(file.name);
            await fileRef.put(file);
            this.anuncio.fotos.push(await fileRef.getDownloadURL());
            console.log("se subio la img: ", file.name)
            cb();
        },

        fetchAnuncios() {
            this.anuncios = [];
            this.anuncio = {
                "compania_tel": "",
                "Screen_size": 0,
                "ram": 0,
                "rom": 0,
                "estado": "",
                "descripcion": "",
                "precio": 0,
                "sistema": "",
                "nombreVendedor": "",
                "id_modelo": "",
                "titulo": "",
                "telVendedor": "",
                "fotos": [],
                "fecha": ""
            };
            db.collection("anuncio").get().then((docs) => {
                docs.forEach((docu) => {
                    this.anuncios.push(
                        // "id": docu.id,
                        docu.data(),
                    );
                });
            });
        },

        agregarNuevoAnuncio() {
            //hacer todo procedimiento interno para quefuncione el objeto JSON
            this.anuncio.fecha = getFecha();
            this.anuncio.id_modelo = this.modeloSel.id;

            let requests = this.fotoFiles.map((file) => {
                return new Promise((resolve) => {
                    this.uploadImages(file, resolve);
                });
            });

            Promise.all(requests).then(() => {
                console.log('finalizó la subida')
                db.collection("anuncio").add(vueApp.anuncio).then(function (docRef) {
                    vueApp.marcaSel = "";
                    vueApp.modeloSel = "";
                    vueApp.fotoFiles = [];
                    vueApp.fotoTmp = [];
                    vueApp.pasoModal = 1;
                    vueApp.fetchAnuncios();
                    console.log("El documento se ha escrito y su id es: ", docRef.id);
                }).catch(function (error) {
                    console.error("Error al tratar de agregar el documento", error);
                });
            });
        },
    },

    computed: {

    },
    mounted: function () {
        console.log("iniciado");
        this.fetchAnuncios()
        this.fetchMarca();
        this.fetchModelo();
    },

});

/**
 * Esta funcion es para obtener la fecha
 */
function getFecha() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

function diffDays(fecha) {
    //    var fechaActual = getFecha(); Retorna NaN, super weird
    var fechaActual = new Date().getTime();
    var firstDate = new Date(fecha).getTime();
    var diff = fechaActual - firstDate;
    let total =Math.round((diff / (1000 * 60 * 60 * 24)));
    return  total===1?`${total} día`:`${total} días`;
}
