const getAndLoadPage = (viewName) => {
    $('#mainContentDiv').load('/views/success/' + viewName)
};

const getAndLoadError = (errorNumber) => {
    $('#mainContentDiv').load('/views/errors/' + errorNumber)
};


const getFormValuesFromClick = (event) => {
    let formName = $(event.currentTarget).closest('form').attr('name');
    return getFormValues(formName);
};

const getFormValues = (name) => {
    let map = {};
    $('form[name=' + name + ']')
        .find('input[type=text],input[type=email],input[type=password],select')
        .each(function() {
            map[$(this).attr('name')] = $(this).val();
        });
    return map;
};

const loadNavBarLinks = (permissions) => {
    let html = "";
    permissions.forEach(permission => {
        html +=  '<li class="nav-item" id="navbarApplication'+ permission +'" data-toggle="tooltip" data-placement="right" title="'+permission+'" style="display:none;"><a class="nav-link" data-link="'+permissions+'" href="#"><i class="fa fa-fw fa-circle-o-notch"></i><span class="nav-link-text"> '+permission+'</span></a></li>';
    });
    $('#navAccordion').html(html);
    $('#navAccordion a, #navBarHomeButton').click((event) => {
        let route = $(event.currentTarget).attr('data-link');
        if (route) {
            getAndLoadPage(route);
        }
    });
    $('#navAccordion li').show("slow");
};

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

const toast = (type, toastMessage, toastTitle) => {
    if(!toastTitle){
        toastTitle = 'Notification'
    }
    toastr[type](toastMessage, toastTitle);
};

const toastS = (toastmessage, toastTitle) => {
    toast('success', toastmessage, toastTitle);
};

const toastW = (toastmessage, toastTitle) => {
    toast('warning', toastmessage, toastTitle);
};

const toastE = (toastmessage, toastTitle) => {
    toast('error', toastmessage, toastTitle);
};

const toastI = (toastmessage, toastTitle) => {
    toast('info', toastmessage, toastTitle);
};